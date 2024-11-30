import { useEffect, useState } from 'react';
import reactLogo from '@/assets/react.svg';
import wxtLogo from '/wxt.svg';
import { Input, Modal, message } from 'antd';
import { triggerUnmountUi } from '@/utils/content_ui'
import { handleRequest } from '@/utils/vectordb_api';
import './SearchBar.css'
import { modalStyles } from '@/utils/theme';

function App() {
    const [visible, setVisible] = useState(true);
    const [searchText, setSearchText] = useState('')
    const [collectionName, setCollectionName] = useState('')
    
    function handleSearchClose() {
      setVisible(false)
    }
    useEffect(() => {
        document.getElementById("search-input")?.focus()
        browser.runtime.onMessage.addListener((msg) => {
          if (!('action' in msg)) return;
          if (msg.action === 'cui:closeSearch') {
            handleSearchClose()
          }
        })
    }, [])

    function handleSearchInput(e: React.ChangeEvent<HTMLInputElement>) {
      let val = e.target.value
      if (val.startsWith('$') && val.endsWith(' ')) {
        val = val.trim().slice(1)
        if (!val) {
          setSearchText('$ ')
          return;
        }
        handleRequest('listCollections')
        .then((colls) => {
          if (val === 'all') {
            setCollectionName('')
            return message.info(`Set to all collections`)
          } else if (!colls.includes(val)) {
            return message.error(`No such collection ${val}`)
          } 
          setCollectionName(val)
          setSearchText('')
        })
      } else {
        setSearchText(val)
      }
    }
  

    function handleSearchSubmit() {
      handleRequest('manageDocuments', {
        collectionName, 
        method:"GET", 
        data: { 
          query: searchText
        }
      })
      .then(console.log)
    }

    function handleInputKeydown(e: React.KeyboardEvent<HTMLInputElement>) {
        switch (e.key) {
            case 'Enter':
                e.stopPropagation();
                handleSearchSubmit();
                break;
            case 'Escape':
                handleSearchClose();
                break;
            default:
                break;
        }
    }

    return (
      <>
        <Modal
          style={{
            zoom: 1.2
          }}
          styles={{
            body: {
              backgroundColor: modalStyles.contentBg
            },
            content: {
              backgroundColor: modalStyles.contentBg
            }
          }}
          open={visible}
        //   onCancel={handleCloseModal}
          footer={null}
          closable={false}
        >
          <Input
          addonBefore={collectionName}
          styles={{
            input: {
              backgroundColor: modalStyles.inputBg,
              color: modalStyles.inputColor,
              borderColor: modalStyles.inputBorderColor
            },
          }}
          className=' placeholder:text-slate-500'
          id='search-input'
          autoFocus={true}
          value={searchText}
          onChange={handleSearchInput}
          onKeyDown={handleInputKeydown}
          placeholder="Search your knowledge base - MemEx" />
        </Modal>
      </>
    );
}

export default App;
