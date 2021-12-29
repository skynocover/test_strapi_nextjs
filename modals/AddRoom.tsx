import React from 'react';
import * as antd from 'antd';
import { useRouter } from 'next/router';

import { AppContext } from '../components/AppContext';
import { Notification } from '../components/Notification';

export const AddRoom = ({ onSuccess }: { onSuccess: any }) => {
  const appCtx = React.useContext(AppContext);
  const router = useRouter();
  React.useEffect(() => {}, []);

  const onFinish = async (values: any) => {
    appCtx.setModal(null);

    const data = await appCtx.fetch('post', `http://localhost:1337/api/rooms`, {
      data: { type: values.type, roomNo: values.roomNo, beds: values.beds },
    });

    if (data) {
      Notification.add('success', 'Success Add');
      onSuccess();
    }
  };

  return (
    <antd.Form onFinish={onFinish} initialValues={{ beds: 1 }}>
      <h5 className="font-weight-bold mb-4">Add Room</h5>
      <antd.Form.Item
        name="type"
        label="room type"
        rules={[{ required: true, message: 'Input Service Name' }]}
      >
        <antd.Input prefix={<i className="fa fa-desktop" />} placeholder="Please Input Type" />
      </antd.Form.Item>
      <antd.Form.Item
        name="roomNo"
        label="Room No."
        rules={[{ required: true, message: 'Input Room No.' }]}
      >
        <antd.Input prefix={<i className="fa fa-desktop" />} placeholder="Please Input Room No." />
      </antd.Form.Item>
      <antd.Form.Item name="beds" label="Beds" rules={[{ required: true, message: 'Input Beds' }]}>
        <antd.InputNumber placeholder="Please Input Beds" />
      </antd.Form.Item>
      <antd.Form.Item className="text-center">
        <antd.Button type="primary" htmlType="submit">
          新增
        </antd.Button>
      </antd.Form.Item>
    </antd.Form>
  );
};
