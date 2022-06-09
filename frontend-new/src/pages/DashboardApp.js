import { faker } from '@faker-js/faker';
// @mui
import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography } from '@mui/material';
import axios from 'axios';
// components
import Page from '../components/Page';
import Iconify from '../components/Iconify';
import AreaChart from '../components/AreaChart';

// sections
import {
  AppTasks,
  AppNewsUpdate,
  AppOrderTimeline,
  AppCurrentVisits,
  AppWebsiteVisits,
  AppTrafficBySite,
  AppWidgetSummary,
  AppCurrentSubject,
  AppConversionRates,
} from '../sections/@dashboard/app';

// ----------------------------------------------------------------------

const URL_FETCH_TEMP_RECORDS = 'http://localhost:8080/api/temps/power';
const URL_FETCH_POWER_RECORDS = 'http://localhost:8080/api/bulbs/power';
const URL_BACKEND_FETCH_LIGHT_RECORDS = 'http://localhost:8080/api/lights';
const URL_BACKEND_FETCH_TEMP_RECORDS = 'http://localhost:8080/api/temps';
function getSevenDates() {
  const date = new Date();
  const curDate = [new Date(date.setDate(date.getDate() + 1))];
  for (let i = 0; i < 6; i += 1) {
    const curGetDate = curDate[i].getDate() > 2 ? curDate[i].getDate() : curDate[i].getDate() + 30;
    curDate.push(new Date(curDate[i].setDate(curGetDate - 1)));
  }
  const ret = curDate.map((date) => {
    const str = `${date.getDate()}/${date.getMonth() + 1}`;
    return str;
  });
  console.log(`ret: ${ret}`);
  return ret;
}
export default function DashboardApp() {
  const theme = useTheme();
  const [tempRecords, setTempRecords] = useState([]);
  const [powerRecords, setPowerRecords] = useState([]);
  const [lightRecords2, setLightRecords2] = useState([]);
  const [tempRecords2, setTempRecords2] = useState([]);

  useEffect(() => {
    axios.get(URL_FETCH_TEMP_RECORDS).then((res) => {
      const tempRecords = res.data;
      if (tempRecords && tempRecords.length) {
        setTempRecords(tempRecords);
      }
    });
    axios.get(URL_FETCH_POWER_RECORDS).then((res) => {
      const powerRecords = res.data;
      if (powerRecords && powerRecords.length) {
        setPowerRecords(powerRecords);
      }
    });
    axios
      .get(URL_BACKEND_FETCH_LIGHT_RECORDS)
      .then((res) => {
        const light = res.data;
        if (light) {
          setLightRecords2(light);
        }
      })
      .catch((err) => {
        console.log(err);
      });
    axios
      .get(URL_BACKEND_FETCH_TEMP_RECORDS)
      .then((res) => {
        const temp = res.data;
        if (temp) {
          setTempRecords2(temp);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <Page title="Dashboard">
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Xin chào,
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={6}>
            <AppWidgetSummary title="Số đèn" total={25} icon={'ant-design:bulb-filled'} />
          </Grid>

          <Grid item xs={12} sm={6} md={6}>
            <AppWidgetSummary
              title="Điện năng tiêu thụ (W)"
              total={powerRecords.reduce((x, y) => parseInt(x, 10) + y, 0)}
              color="info"
              icon={'ant-design:calendar-filled'}
            />
          </Grid>

          {/* <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Item Orders" total={1723315} color="warning" icon={'ant-design:windows-filled'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Bug Reports" total={234} color="error" icon={'ant-design:bug-filled'} />
          </Grid> */}

          <Grid item xs={12} md={6} lg={8}>
            <AppWebsiteVisits
              title="Biểu đồ tổng quan nhiệt độ trong 7 ngày gần nhất"
              subheader="(+43%) than yesterday"
              chartLabels={getSevenDates()}
              chartData={[
                {
                  name: 'Nhiệt độ',
                  type: 'area',
                  fill: 'gradient',
                  data: tempRecords,
                },
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentVisits
              title="Thống kê lượng điện năng được sử dụng của các tầng trong tòa nhà"
              chartData={[
                { label: 'Tầng 0', value: parseInt(powerRecords[0], 10) },
                { label: 'Tầng 1', value: parseInt(powerRecords[1], 10) },
                { label: 'Tầng 2', value: parseInt(powerRecords[2], 10) },
                { label: 'Tầng 3', value: parseInt(powerRecords[3], 10) },
                { label: 'Tầng 4', value: parseInt(powerRecords[4], 10) },
                { label: 'Tầng 5', value: parseInt(powerRecords[5], 10) },
              ]}
              chartColors={[
                theme.palette.primary.main,
                theme.palette.chart.blue[0],
                theme.palette.chart.violet[0],
                theme.palette.chart.yellow[0],
              ]}
            />
          </Grid>
          {/* 
          <Grid item xs={12} md={6} lg={8}>
            <AppConversionRates
              title="Conversion Rates"
              subheader="(+43%) than last year"
              chartData={[
                { label: 'Italy', value: 400 },
                { label: 'Japan', value: 430 },
                { label: 'China', value: 448 },
                { label: 'Canada', value: 470 },
                { label: 'France', value: 540 },
                { label: 'Germany', value: 580 },
                { label: 'South Korea', value: 690 },
                { label: 'Netherlands', value: 1100 },
                { label: 'United States', value: 1200 },
                { label: 'United Kingdom', value: 1380 },
              ]}
            />
          </Grid> */}

          {/* <Grid item xs={12} md={6} lg={4}>
            <AppCurrentSubject
              title="Current Subject"
              chartLabels={['English', 'History', 'Physics', 'Geography', 'Chinese', 'Math']}
              chartData={[
                { name: 'Series 1', data: [80, 50, 30, 40, 100, 20] },
                { name: 'Series 2', data: [20, 30, 40, 80, 20, 80] },
                { name: 'Series 3', data: [44, 76, 78, 13, 43, 10] },
              ]}
              chartColors={[...Array(6)].map(() => theme.palette.text.secondary)}
            />
          </Grid> */}

          {/* <Grid item xs={12} md={6} lg={8}>
            <AppNewsUpdate
              title="News Update"
              list={[...Array(5)].map((_, index) => ({
                id: faker.datatype.uuid(),
                title: faker.name.jobTitle(),
                description: faker.name.jobTitle(),
                image: `/static/mock-images/covers/cover_${index + 1}.jpg`,
                postedAt: faker.date.recent(),
              }))}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppOrderTimeline
              title="Order Timeline"
              list={[...Array(5)].map((_, index) => ({
                id: faker.datatype.uuid(),
                title: [
                  '1983, orders, $4220',
                  '12 Invoices have been paid',
                  'Order #37745 from September',
                  'New order placed #XF-2356',
                  'New order placed #XF-2346',
                ][index],
                type: `order${index + 1}`,
                time: faker.date.past(),
              }))}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppTrafficBySite
              title="Traffic by Site"
              list={[
                {
                  name: 'FaceBook',
                  value: 323234,
                  icon: <Iconify icon={'eva:facebook-fill'} color="#1877F2" width={32} height={32} />,
                },
                {
                  name: 'Google',
                  value: 341212,
                  icon: <Iconify icon={'eva:google-fill'} color="#DF3E30" width={32} height={32} />,
                },
                {
                  name: 'Linkedin',
                  value: 411213,
                  icon: <Iconify icon={'eva:linkedin-fill'} color="#006097" width={32} height={32} />,
                },
                {
                  name: 'Twitter',
                  value: 443232,
                  icon: <Iconify icon={'eva:twitter-fill'} color="#1C9CEA" width={32} height={32} />,
                },
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppTasks
              title="Tasks"
              list={[
                { id: '1', label: 'Create FireStone Logo' },
                { id: '2', label: 'Add SCSS and JS files if required' },
                { id: '3', label: 'Stakeholder Meeting' },
                { id: '4', label: 'Scoping & Estimations' },
                { id: '5', label: 'Sprint Showcase' },
              ]}
            />
          </Grid> */}
          <Grid item xs={12} md={6} lg={6}>
            <AreaChart records={lightRecords2} title="Today Light records" />
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <AreaChart records={tempRecords2} title="Today Temp records" />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
