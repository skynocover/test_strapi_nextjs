import React from 'react';
import * as antd from 'antd';

import { AppContext } from './AppContext';
import { useRouter } from 'next/router';
import { useSession, signOut } from 'next-auth/client';

interface MainPageProps {
  menuKey: string;
  content: JSX.Element;
}

const MainPage = ({ menuKey, content }: MainPageProps) => {
  const router = useRouter();
  const appCtx = React.useContext(AppContext);

  const [session, loading] = useSession();

  React.useEffect(() => {}, []);

  const renderHeader = () => {
    return (
      <antd.Layout.Header
        className="flex items-center px-3 bg-white shadow-sm"
        style={{ zIndex: 1 }}
      >
        <div>
          <span className="ml-2 text-white">{menuKey}</span>
        </div>

        <div className="flex-1" />
        <antd.Popover
          placement="bottom"
          content={
            <div className="flex flex-column">
              <antd.Button
                type="link"
                danger
                onClick={() => {
                  signOut();
                  router.push('/');
                }}
              >
                登出
              </antd.Button>
            </div>
          }
        >
          <antd.Button type="link" icon={<i className="fa fa-user mr-2" />}>
            {`使用者 : ${session?.user?.name}`}
          </antd.Button>
        </antd.Popover>
      </antd.Layout.Header>
    );
  };

  const renderContent = () => {
    return (
      <antd.Layout.Content style={{ overflow: 'auto' }}>
        <div className="m-3">{content}</div>
      </antd.Layout.Content>
    );
  };

  const renderMenu = () => {
    const init: string[] = ['Home', 'Reserve', 'Dishes'];
    return (
      <antd.Layout.Sider collapsible trigger={null} style={{ overflow: 'auto' }}>
        <antd.Menu
          theme="dark"
          mode="inline"
          selectedKeys={[menuKey]}
          onClick={({ key }) => {
            router.push(key);
          }}
        >
          {init.map((page) => {
            return (
              <antd.Menu.Item key={page}>
                <span className="flex items-center">
                  <span>{page}</span>
                </span>
              </antd.Menu.Item>
            );
          })}
        </antd.Menu>
      </antd.Layout.Sider>
    );
  };

  return (
    <antd.Layout className="h-screen">
      {renderMenu()}

      <antd.Layout className="bg-white">
        {renderHeader()}
        {renderContent()}
      </antd.Layout>
    </antd.Layout>
  );
};

export { MainPage };
