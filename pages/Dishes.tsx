import React from 'react';
import useSWR from 'swr';

import { useRouter } from 'next/router';
import { AppContext } from '../components/AppContext';

import { Button, Card, CardBody, CardImg, CardText, CardTitle, Col, Row } from 'reactstrap';
import Cart from '../components/Cart';

const Restaurants = () => {
  const router = useRouter();

  const appCtx = React.useContext(AppContext);
  const [dataSource, setDataSource] = React.useState<any[]>([]); //coulmns data
  const [upPrice, setUpPrice] = React.useState<number>();
  const [downPrice, setDownPrice] = React.useState<number>();
  const [dishType, setDishType] = React.useState<'' | 'regular' | 'vip' | 'comercial'>();

  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const [total, setTotal] = React.useState<number>(0);
  const pageSize = 10;

  const init = async (page: number = currentPage) => {
    let params = new URLSearchParams();
    params.append('pagination[page]', page.toString());
    params.append('pagination[pageSize]', pageSize.toString());
    params.append('populate', '*');
    dishType && params.append('filters[dish_type][name][$eq]', dishType);
    upPrice && params.append('filters[price][name][$lte]', upPrice.toString());
    downPrice && params.append('filters[price][name][$gte]', downPrice.toString());
    // dishes?populate=*&filters[dish_type][name][$eq]=meat
    const data = await appCtx.fetch('get', `http://localhost:1337/api/dishes?${params.toString()}`);

    if (data) {
      const temp = data.data.map((item: any) => {
        return { id: item.id, ...item.attributes };
      });

      console.log(temp);
      setDataSource(temp);
    }

    // setDataSource(temp);
    // setCurrentPage(page);
    // setTotal(data.meta.pagination.total);
  };

  React.useEffect(() => {
    init();
  }, [dishType]);

  return (
    <>
      <Row>
        {dataSource.map((res) => (
          <Col xs="6" sm="4" style={{ padding: 0 }} key={res.id}>
            <Card style={{ margin: '0 10px' }}>
              <CardImg
                top={true}
                style={{ height: 250 }}
                src={`${process.env.NEXT_PUBLIC_API_URL}${res.image.data.attributes.url}`}
              />
              <CardBody>
                <CardTitle>{res.name}</CardTitle>
                <CardText>{res.description}</CardText>
              </CardBody>
              <div className="card-footer">
                <Button outline color="primary" onClick={() => appCtx.addItem(res)}>
                  + Add To Cart
                </Button>

                <style jsx>
                  {`
                    a {
                      color: white;
                    }
                    a:link {
                      text-decoration: none;
                      color: white;
                    }
                    .container-fluid {
                      margin-bottom: 30px;
                    }
                    .btn-outline-primary {
                      color: #007bff !important;
                    }
                    a:hover {
                      color: white !important;
                    }
                  `}
                </style>
              </div>
            </Card>
          </Col>
        ))}
        <Col xs="3" style={{ padding: 0 }}>
          <div>
            <Cart />
          </div>
        </Col>
      </Row>
    </>
  );

  return <h1>Add Dishes</h1>;
};
export default Restaurants;
