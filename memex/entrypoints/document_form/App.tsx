
import React, { Suspense, useEffect, useMemo, useState } from 'react';
import { type MenuProps, Form, Input, Button, message, Tag,
   Modal, Dropdown, Skeleton } from 'antd';
import { UserOutlined, DatabaseOutlined, PlusOutlined } from '@ant-design/icons'
import { sleep } from '@/utils/common';
// import { navigateContentUi } from '@/utils/content_ui';
import { handleRequest } from '@/utils/vectordb_api';
import { modalStyles } from '@/utils/theme'


const DocumentForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState<Array<string>>([]);
  const [visible, setVisible] = useState(true)
  const [currTag, setCurrTag] = useState("")
  const [createMode, setCreateMode] = useState(false)

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const response = await handleRequest('manageDocuments', {
        collectionName: values.collectionName, 
        method: 'POST', 
        data: {
          ids: [Date.now().toString()],
          documents: [`
TITLE: ${values.title}
DESCRIPTION: ${values.description}
`         ],
          metadatas: [{
            title: values.title,
            tags: JSON.stringify(tags),
            createdAt: Date.now()
          }]
        }
      });
      console.log('Document added:', response);
      message.success('Document added successfully!');
      form.resetFields();
      setTags([]);
    } catch (error) {
      console.error('Error adding document:', error);
      message.error('Failed to add document. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleTagChange = (tag: string, action: "remove") => {
    if (action === 'remove') {
      setTags(tags.filter(t => t !== tag));
    }
  };

  const handleTagSubmit = (newTag: string) => {
    if (!tags.includes(newTag)) {
      setTags([...tags, newTag])
      setCurrTag('')
    }
  };

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    message.info('Click on left button.');
    console.log('click left button', e);
  };



  const DropdownLzMz = useMemo(() => {
    let items: MenuProps['items'] = [];
    
    return React.lazy(async () => {
      await sleep(1)
      return handleRequest('listCollections')
      .then(data => {
        return (data ?? []).map((d: string, i: Number) => ({
          title: d,
          key: i.toString(),
          label: d
        })) 
      })
      .then(items => {
        const handleMenuClick: MenuProps['onClick'] = (e) => {
          let selectedVal = items.find((i: any) => i.key === e.key)?.label
          message.info(`Collection set to ${selectedVal}`);
          console.log('click', e);
          form.setFieldValue('collectionName', selectedVal)
        };
        const menuProps = {
          items,
          onClick: handleMenuClick,
        };
        return {
          default: () => <Dropdown.Button menu={{
            ...menuProps,
            style: {
              // backgroundColor: "#333",
              color: "#ccc",
              textTransform: "capitalize",
              // backgroundColor: 'rgba(200,200,200,0.2)'
            },
            color: "#ccc",
          }} 
          style={{
            color: "#ccc",
            textTransform: "capitalize",
            width: 'fit-content'
          }}
          icon={<DatabaseOutlined/>}
          >
            <span style={{color: "#333",}}>{form.getFieldValue('collectionName') ?? 'Select Collection'}</span>
          </Dropdown.Button>
        }
      })
    })
  }, [])

  function handleCloseModal() {
    setVisible(false)
  }


  
  useEffect(() => {
    browser.runtime.onMessage.addListener((msg) => {
      if (!('action' in msg)) return;
      if (msg.action === 'cui:closeSearch') {
        handleCloseModal()
      }
    })
  }, [])
  

  return (
    <Modal
    destroyOnClose
    styles={{
      body: {
        // backgroundColor: 'rgba(100,100,100,0.5)'
        // backdropFilter: 'blur(1px)'
      },
      content: {
        backgroundColor: modalStyles.contentBg,
        backdropFilter: 'blur(7px)',
        // border: '1px solid #999'
        // mixBlendMode: 'luminosity'
      }
    }}
    open={visible}
    style={{
      top: '25px',
      scrollbarWidth: 'none'
    }}
  //   onCancel={handleCloseModal}
    footer={null}
    closable={false}
  >
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Form.Item 
      className='mb-2'
      label={<label className="text-slate-200">Collection</label>}
      name="collectionName"
      rules={[{ required: true, message: 'Please select a collection' }]}>
        <div className='flex justify-start gap-4 items-center'>        
          <Suspense fallback={<Skeleton.Button style={{backgroundColor: '#445', height: '32px', width: '150px', color: '#ccc'}} active shape='default' size='large'/>}>
            <DropdownLzMz/>
        </Suspense>
        {<Input  
        suffix={<Button onClick={(e) => {
          const el = document.getElementById('createCollection')
          if (el?.dataset.open) {
            setCreateMode(false)
            delete el.dataset.open
          } else if (el?.dataset) {
            setCreateMode(true)
            el.dataset.open = 'true'
          } else throw {error: "el not found"}
        }} title='Create Collection' 
        icon={
        <PlusOutlined
        className={`${createMode && 'rotate-45'} transition-all`}
        />} />}
        id="createCollection" className=' data-[open]:w-3/5 w-0' placeholder='Collection Name'/>}
        
        </div>
      </Form.Item>
      <Form.Item
        className='mb-2'
        label={<label className="text-slate-200">Title</label>}
        name="title"
        rules={[{ required: true, message: 'Please enter the title' }]}
      >
        {/* <Button onClick={() => navigateContentUi('search_bar.html')}>Search</Button> */}
        <Input autoFocus className='placeholder:text-slate-500' placeholder="Title" styles={{
          input: {
            color: modalStyles.inputColor,
            backgroundColor: modalStyles.inputBg,
            borderColor: modalStyles.inputBorderColor,
            mixBlendMode: 'luminosity'
          },
        }}/>
      </Form.Item>
      <Form.Item
        className='mb-2'
        label={<label className="text-slate-200">Description</label>}
        name="description"
        rules={[{ required: true, message: 'Please enter the description' }]}
      >
        <Input.TextArea styles={{
          textarea: {
            color: modalStyles.inputColor,
            backgroundColor: modalStyles.inputBg,
            borderColor: modalStyles.inputBorderColor,
            resize: 'none',
            mixBlendMode: 'luminosity'
          }
        }}
        style={{
          resize: 'none'
        }}
        className='placeholder:text-slate-500'
        rows={4} placeholder="Description" />
      </Form.Item>
      <Form.Item
      name="tagInput"
      label={<label className="text-slate-200">Tags</label>}>
        <div>
          {tags.length > 0  && <div className='line-clamp-1 overflow-y-auto mb-2' 
          style={{ scrollbarWidth: 'none' }}>
          {tags.map(tag => (
            <Tag key={tag} closable onClose={() => handleTagChange(tag, 'remove')}>
              {tag}
            </Tag>
          ))}
          </div>}
          <Input
            name="tagInput"
            styles={{
              input: {
                color: modalStyles.inputColor,
                borderColor: modalStyles.inputBorderColor,
                backgroundColor: modalStyles.inputBg,
                mixBlendMode: 'luminosity'
              }
            }}
            className='placeholder:text-slate-500'
            placeholder="Add a tag"
            value={currTag}
            onChange={(e) => setCurrTag(e.target.value)}
            onKeyDown={(e) => {
              if (e.code !== 'Enter') return;
              e.preventDefault()
              e.stopPropagation()
              handleTagSubmit(currTag);
            }}
          />
        </div>
      </Form.Item>
      <Form.Item className='flex justify-end mb-1'>
        <Button type="primary" style={{
          background: modalStyles.buttonBg 
        }} htmlType="submit" loading={loading}>
          Add Document
        </Button>
      </Form.Item>
    </Form>
    </Modal>
  );
};

export default DocumentForm;

