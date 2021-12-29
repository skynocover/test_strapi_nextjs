import React from 'react';
import * as antd from 'antd';
import useSWR from 'swr';
// import axios from 'axios';

import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { MainPage } from '../components/MainPage';
import { useRouter } from 'next/router';
import { ColumnsType } from 'antd/lib/table';

import { Notification } from '../components/Notification';
import { AppContext } from '../components/AppContext';
import { DangerButton } from '../components/DangerButton';
import { AddRoom } from '../modals/AddRoom';
import { Reserve } from '../modals/Reserve';
import { getSession } from 'next-auth/client';
import axios from 'axios';

const Home = () => {
  const appCtx = React.useContext(AppContext);
  // 型別
  const [beds, setBeds] = React.useState<'' | '1' | '2' | '4'>();
  const [roomType, setRoomType] = React.useState<'' | 'regular' | 'vip' | 'comercial'>();

  const router = useRouter();
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const pageSize = 10;

  const [page, setPage] = React.useState<{ current: number; size: number }>({
    current: 1,
    size: 10,
  });

  const makeURL = () => {
    let params = new URLSearchParams();
    params.append('pagination[page]', currentPage.toString());
    params.append('pagination[pageSize]', pageSize.toString());
    params.append('filters[checkIn][$eq]', 'false');
    beds && params.append('filters[beds][$eq]', beds);
    roomType && params.append('filters[Type][$eq]', roomType);
    return `http://localhost:1337/api/rooms?${params.toString()}`;
  };

  const { data, error, mutate } = useSWR<{ data: any[]; meta: any }>(makeURL, (url) =>
    appCtx.fetch('get', url),
  );

  const tableData2 = React.useMemo(() => {
    return data?.data.map((item: any) => {
      return { id: item.id, ...item.attributes };
    });
  }, [data]);

  if (!data) {
    return <div />;
  }

  const tableData = data?.data.map((item: any) => {
    return { id: item.id, ...item.attributes };
  });

  const columns: ColumnsType<any> = [
    {
      title: 'Room Number',
      align: 'center',
      dataIndex: 'roomNo',
    },
    {
      title: 'Beds',
      align: 'center',
      dataIndex: 'beds',
    },
    {
      title: 'Type',
      align: 'center',
      dataIndex: 'type',
    },
    {
      align: 'center',
      render: (item) => (
        <antd.Button
          type="primary"
          onClick={() => {
            appCtx.setModal(<Reserve roomNo={item.id} onSuccess={mutate} />);
          }}
        >
          預定
        </antd.Button>
      ),
    },
  ];

  const content = (
    <antd.Spin spinning={!data}>
      <div className="flex justify-end mb-2">
        <div className="flex">
          <div className="mr-2 flex items-center">選擇床數</div>
          <antd.Select
            defaultValue={beds}
            style={{ width: 150 }}
            onChange={(select) => setBeds(select)}
          >
            <antd.Select.Option value="">{''}</antd.Select.Option>
            <antd.Select.Option value="1">1</antd.Select.Option>
            <antd.Select.Option value="2">2</antd.Select.Option>
            <antd.Select.Option value="4">4</antd.Select.Option>
          </antd.Select>
        </div>

        <div className="flex">
          <div className="mx-2 flex items-center">選擇房型</div>
          <antd.Select
            defaultValue={roomType}
            style={{ width: 150 }}
            onChange={(select) => setRoomType(select)}
          >
            <antd.Select.Option value="">{''}</antd.Select.Option>
            <antd.Select.Option value="regular">一般</antd.Select.Option>
            <antd.Select.Option value="comercial">商務</antd.Select.Option>
            <antd.Select.Option value="vip">VIP</antd.Select.Option>
          </antd.Select>
        </div>

        <div className="flex-1" />
        <antd.Button
          type="primary"
          onClick={() => {
            appCtx.setModal(<AddRoom onSuccess={mutate} />);
          }}
        >
          新增
        </antd.Button>
      </div>
      <antd.Table
        dataSource={tableData}
        columns={columns}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: data?.meta.pagination.total,
          onChange: (page) => setCurrentPage(page),
        }}
      />
    </antd.Spin>
  );

  return <MainPage content={content} menuKey="Home" />;
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

export default Home;
