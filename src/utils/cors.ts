import cors from 'cors';

const adminWhiteList = [process.env.ADMIN_URL_1, process.env.ADMIN_URL_2];
export const adminCors = cors({
  origin: (origin, callback) => {
    if (adminWhiteList.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});

//* Only allows the client to make GET requests
// const WhiteList = [
//   process.env.ADMIN_URL_1,
//   process.env.ADMIN_URL_2,
//   process.env.CLIENT_URL_1,
//   process.env.CLIENT_URL_2,
// ];
// export const clientCors = cors({
//   origin: (origin, callback) => {
//     if (WhiteList.indexOf(origin) !== -1) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   methods: ['GET'],
// });

// Allow all origins and methods
export const clientCors = cors();
