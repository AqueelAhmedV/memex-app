
import React, { Suspense, useEffect, useMemo, useState } from 'react';
import { type MenuProps, Form, Input, Button, message, Tag,
   Modal, Dropdown, Skeleton, Switch } from 'antd';
import { UserOutlined, DatabaseOutlined } from '@ant-design/icons'
import { sleep } from '@/utils/common';
// import { navigateContentUi } from '@/utils/content_ui';
import { handleRequest } from '@/utils/vectordb_api';
import { modalStyles } from '@/utils/theme'


const DocumentForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(true)
  const [persist, setPersist] = useState(false)

  const onFinish = async (values: ChromaConfig) => {
    setLoading(true);

    try {
      const response = await handleRequest('configureChroma', {
        is_persistent: persist,
        embedding_function: values.embedding_function,
        embed_api_key: values.embed_api_key
      });
      console.log('Success:', response);
      message.success('Configure success', () => {
        navigateContentUi('search_bar.html')
      });
      form.resetFields();
    } catch (error) {
      console.error('Error:', error);
      message.error('Failed to configure. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  function handleCloseModal() {
    setVisible(false)
    setTimeout(() => {
      triggerUnmountUi()
    }, 300)
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
      name="is_persistent"
      >
      <div className='gap-4 flex '>
        <label className="text-slate-200">Persist Data:</label>  
        <Switch onChange={(checked) => {
          setPersist(checked)
        }} value={persist} title='Persist Data' />
      </div>
      </Form.Item>
      <Form.Item
        className='mb-2'
        label={<label className="text-slate-200">Custom Embedding Function</label>}
        name="embedding_function"
      >
        {/* <Button onClick={() => navigateContentUi('search_bar.html')}>Search</Button> */}
        <Input name='embedding_function' autoFocus className='placeholder:text-slate-500' placeholder="eg: GEMINI, OPENAI" styles={{
          input: {
            color: modalStyles.inputColor,
            backgroundColor: modalStyles.inputBg,
            borderColor: modalStyles.inputBorderColor,
            mixBlendMode: 'luminosity'
          },
        }}/>
      </Form.Item>
      <Form.Item
        label={<label className="text-slate-200">Embedding Model API Key</label>}
        name="embed_api_key"
      >
        {/* <Button onClick={() => navigateContentUi('search_bar.html')}>Search</Button> */}
        <Input name='embed_api_key' type='password'  autoFocus className='placeholder:text-slate-500' placeholder="API Key" styles={{
          input: {
            color: modalStyles.inputColor,
            backgroundColor: modalStyles.inputBg,
            borderColor: modalStyles.inputBorderColor,
            mixBlendMode: 'luminosity'
          },
        }}/>
      </Form.Item>
      <Form.Item className='flex justify-end mb-1'>
        <Button type="primary" style={{
          background: modalStyles.buttonBg 
        }} htmlType="submit" loading={loading}>
          Configure
        </Button>
      </Form.Item>
    </Form>
    </Modal>
  );
};

export default DocumentForm;

