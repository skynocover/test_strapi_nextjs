import React from 'react';
import * as antd from 'antd';
// import axios from 'axios';

import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { MainPage } from '../components/MainPage';
import { useRouter } from 'next/router';
import { ColumnsType } from 'antd/lib/table';

import { Notification } from '../components/Notification';
import { AppContext } from '../components/AppContext';
import { DangerButton } from '../components/DangerButton';
import { AddRoom } from '../modals/AddRoom';
import { getSession } from 'next-auth/client';
import { useSession, signOut } from 'next-auth/client';
import axios from 'axios';

const Reserve = ({ error }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const appCtx = React.useContext(AppContext);
  const [dataSource, setDataSource] = React.useState<any[]>([]); //coulmns data
  const [name, setName] = React.useState<string>('');
  const [roomType, setRoomType] = React.useState<'' | 'regular' | 'vip' | 'comercial'>();

  const [session, loading] = useSession();

  const router = useRouter();
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const [total, setTotal] = React.useState<number>(0);
  const pageSize = 10;

  const init = async (page: number = currentPage) => {
    let params = new URLSearchParams();
    params.append('pagination[page]', page.toString());
    params.append('pagination[pageSize]', pageSize.toString());
    // params.append('filters[checkIn][$eq]', 'false');
    name && params.append('filters[users_permissions_user][username][$contains]', name);
    roomType && params.append('filters[Type][$eq]', roomType);
    const data = await appCtx.fetch(
      'get',
      `http://localhost:1337/api/orders?${params.toString()}&populate=*`,
    );

    const temp = data.data.map((item: any) => {
      return { id: item.id, ...item.attributes };
    });

    console.log(temp);

    setDataSource(temp);
    setCurrentPage(page);
    // setTotal(data.meta.pagination.total);
  };

  React.useEffect(() => {
    if (session) {
      init();
    }
  }, [session, name, roomType]);

  const columns: ColumnsType<any> = [
    {
      title: '訂單編號',
      align: 'center',
      dataIndex: 'id',
    },
    {
      title: '訂單類型',
      align: 'center',
      render: (item) => <p>{item.order_type.data?.attributes.name}</p>,
    },
    {
      title: '備註',
      align: 'center',
      dataIndex: 'description',
    },
    {
      title: '房間號碼',
      align: 'center',
      render: (item) => <p>{item.room.data?.attributes.roomNo}</p>,
    },
    {
      title: '客戶名稱',
      align: 'center',
      render: (item) => <p>{item.users_permissions_user.data?.attributes.username}</p>,
    },
    {
      align: 'center',
      render: (item) => (
        <antd.Button
          type="primary"
          onClick={() => {
            appCtx.setModal(<Reserve roomNo={item.id} onSuccess={init} />);
          }}
        >
          CheckIn
        </antd.Button>
      ),
    },
  ];

  const content = (
    <>
      <div className="flex justify-start mb-2">
        <div className="flex">
          <div className="mr-2 flex items-center">客戶名稱</div>
          <antd.Input
            placeholder="請輸入客戶名稱"
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
        </div>
      </div>
      <antd.Table
        dataSource={dataSource}
        columns={columns}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: total,
          onChange: (page) => init(page),
        }}
      />
    </>
  );

  return <MainPage content={content} menuKey="Reserve" />;
};

export const getServerSideProps: GetServerSideProps = async ({ req, res, query }) => {
  try {
    const session = await getSession({ req });
    if (!session) {
      return {
        redirect: {
          permanent: false,
          destination: '/',
        },
        props: {},
      };
    }

    return { props: {} };
  } catch (error: any) {
    return { props: { error: error.message } };
  }
};

export default Reserve;
