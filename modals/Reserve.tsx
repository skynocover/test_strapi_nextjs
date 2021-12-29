import React from 'react';
import * as antd from 'antd';
import { useRouter } from 'next/router';
import moment from 'moment';

import { useSession } from 'next-auth/client';
import { AppContext } from '../components/AppContext';
import { Notification } from '../components/Notification';

export const Reserve = ({ roomNo, onSuccess }: { roomNo: number; onSuccess: any }) => {
  const appCtx = React.useContext(AppContext);
  const router = useRouter();

  const [session, loading] = useSession();

  const [text, setText] = React.useState<string>('');
  const [dates, setDates] = React.useState<string[]>([]);

  React.useEffect(() => {
    console.log(session);
  }, []);

  const onFinish = async (values: any) => {
    appCtx.setModal(null);

    const data = await appCtx.fetch('post', `http://localhost:1337/api/orders`, {
      data: {
        users_permissions_user: session?.id!,
        order_type: 1,
        room: roomNo,
        description: text,
        start: dates[0],
        end: dates[1],
      },
    });

    if (data) {
      Notification.add('success', 'Success Add');
      onSuccess();
    }
  };

  return (
    <antd.Form onFinish={onFinish} initialValues={{ beds: 1 }}>
      <h5 className="font-weight-bold mb-4">Reserve</h5>
      <antd.DatePicker.RangePicker onChange={(dates, dateStrings) => setDates(dateStrings)} />
      <antd.Input.TextArea
        rows={4}
        onChange={(e) => {
          setText(e.target.value);
        }}
      />
      <antd.Form.Item className="text-center">
        <antd.Button type="primary" htmlType="submit">
          新增
        </antd.Button>
      </antd.Form.Item>
    </antd.Form>
  );
};
