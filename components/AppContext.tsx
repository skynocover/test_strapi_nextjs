import React from 'react';
import axios from 'axios';
import * as antd from 'antd';

import { useSession, signOut } from 'next-auth/client';

import { Notification } from '../components/Notification';

interface AppContextProps {
  setModal: (modal: any) => void;

  account: string;
  setAccount: (value: string) => void;
  isAdmin: boolean;
  setIsAdmin: (value: boolean) => void;

  fetch: (
    method: 'get' | 'post' | 'put' | 'delete' | 'patch',
    url: string,
    param?: any,
  ) => Promise<any>;

  cart: any[];
  setCart: React.Dispatch<React.SetStateAction<any[]>>;
  total: number;
  setTotal: React.Dispatch<React.SetStateAction<number>>;
  addItem: (item: { id: string; price: number; quantity: number }) => void;
  removeItem: (item: { id: string; price: number; quantity: number }) => void;
}

const AppContext = React.createContext<AppContextProps>(undefined!);

interface AppProviderProps {
  children: React.ReactNode;
}

const AppProvider = ({ children }: AppProviderProps) => {
  const [modal, setModal] = React.useState<any>(null);

  const [session, loading] = useSession();

  const [account, setAccount] = React.useState('admin');
  const [isAdmin, setIsAdmin] = React.useState(false);

  ///////////////////////////////////////
  const [cart, setCart] = React.useState<any[]>([]);
  const [total, setTotal] = React.useState<number>(0);

  const addItem = (item: { id: string; price: number; quantity: number }) => {
    //check for item already in cart
    //if not in cart, add item if item is found increase quanity ++
    const newItem = cart.find((i) => i.id === item.id);
    // if item is not new, add to cart, set quantity to 1
    if (!newItem) {
      //set quantity property to 1
      item.quantity = 1;
      console.log(total, item.price);
      setCart([...cart, item]);
      setTotal(total + item.price);
    } else {
      setCart(
        cart.map((item) =>
          item.id === newItem.id ? Object.assign({}, item, { quantity: item.quantity + 1 }) : item,
        ),
      );

      setTotal(total + item.price);
    }
  };
  const removeItem = (item: { id: string; price: number; quantity: number }) => {
    //check for item already in cart
    //if not in cart, add item if item is found increase quanity ++
    const newItem = cart.find((i) => i.id === item.id);
    if (newItem.quantity > 1) {
      setCart(
        cart.map((item) =>
          item.id === newItem.id ? Object.assign({}, item, { quantity: item.quantity - 1 }) : item,
        ),
      );

      setTotal(total - item.price);
    } else {
      const items = [...cart];
      const index = items.findIndex((i) => i.id === newItem.id);

      items.splice(index, 1);

      setCart(items);
      setTotal(total - item.price);
    }
  };

  /////////////////////////////////////////////////////

  React.useEffect(() => {
    axios.defaults.baseURL = '';
    axios.defaults.headers.common['Content-Type'] = 'application/json';
  }, []);

  const fetch = async (
    method: 'get' | 'post' | 'put' | 'delete' | 'patch',
    url: string,
    param?: any,
  ) => {
    let data: any = null;
    try {
      const response = await axios({
        method,
        url,
        data: param,
        headers: { Authorization: 'Bearer ' + session?.jwt! },
      });
      console.log('response', response.data);

      data = response.data;
    } catch (error: any) {
      Notification.add('error', error.message);
    }
    return data;
  };

  /////////////////////////////////////////////////////

  return (
    <AppContext.Provider
      value={{
        setModal: (modal: any) => setModal(modal),

        account,
        setAccount,
        isAdmin,
        setIsAdmin,

        fetch,

        cart,
        setCart,
        total,
        setTotal,
        addItem,
        removeItem,
      }}
    >
      {modal && (
        <antd.Modal
          visible={modal !== null}
          onOk={() => setModal(null)}
          onCancel={() => setModal(null)}
          footer={null}
          closable={false}
        >
          {modal}
        </antd.Modal>
      )}

      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppProvider };
