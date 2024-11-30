import { useEffect, useState } from 'react';
import reactLogo from '@/assets/react.svg';
import wxtLogo from '/wxt.svg';
import { Avatar, Drawer, Input, Modal, Segmented, message } from 'antd';
import { triggerUnmountUi } from '@/utils/content_ui'
import './Navbar.css'
import { DatabaseFilled, DatabaseOutlined, SearchOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';

function App() {
    const [visible, setVisible] = useState(true);
    const [navLink, setNavLink] = useState('')
    
    function handleSearchClose() {
      setVisible(false)
      setTimeout(() => {
        triggerUnmountUi()
      }, 300)
    }
    useEffect(() => {
        browser.runtime.onMessage.addListener((msg) => {
          if (!('action' in msg)) return;
          if (msg.action === 'cui:closeSearch') {
            handleSearchClose()
          }
        })
        function handleKeydown(e) {
          if (e.key.startsWith('Arrow') || e.code.startsWith('Arrow')) 
            e.stopPropagation()
          if (document.querySelectorAll('.ant-segmented-item-selected').length === 0)
            document.querySelector(".ant-segmented-item")?.click()
          if (e.key === "Enter" || e.code === "Enter") {
            e.preventDefault()
            console.log({navLink})
            handleNavigate(navLink)
          }
        }

        window.addEventListener('keydown', handleKeydown)

        return () => {
          window.removeEventListener('keydown', handleKeydown)
        }
    }, [navLink])
  

    function handleNavigate(navTo: string) {
      navigateContentUi(navTo)
      setVisible(false)
    }

    return (
      <Drawer placement='left' open={visible}
        styles={{
          body: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: 'fit-content',
          },
          content: {
            overflow: 'hidden',
            width: '84px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: 'rgba(100,100,100,0.7)',
            backdropFilter: 'blur(7px)'
          },
          header: {
            display: 'none'
          }
        }}
      >
        <Segmented
        autoFocus
        value={navLink}
        onChange={(value) => {
          // console.log("change", value)
          setNavLink(value)
        }}
      options={[
        {
          label: (
            <div style={{ padding: 20 }}>
              <Avatar style={{ backgroundColor: '#336688' }} icon={<SearchOutlined />}/>
            </div>
          ),
          value: 'search_bar.html',
            
        },
        {
          label: (
            <div style={{ padding: 20 }}>
              <Avatar style={{ backgroundColor: '#f56a00' }} icon={<DatabaseOutlined />}/>
            </div>
          ),
          value: 'document_form.html',
        },
        {
          label: (
            <div style={{ padding: 20, }}>
              <Avatar style={{ backgroundColor: '#87d068' }} icon={<SettingOutlined />} />
            </div>
          ),
          value: 'configure.html',
        },
      ]}
    />
      </Drawer>
    );
}

export default App;
