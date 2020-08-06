# GOLB Community

![screenshot](https://github.com/duongdev/golb/blob/master/screenshot.png)

**_Note_**: _This project is for demo purpose, which means it's not yet ready for production._

Pretty SSR blogging website using [Next.js](http://nextjs.org) and Express.js.

## Features

- [x] Guest users can read all the posts but cannot comment until they login.

- [x] Authenticated users can create/update/delete their own posts, as well as comment on all other posts using their credentials.

- [x] Everyone can login using his/her GitHub or _Twitter (coming soon)_ account.

- [x] Everyone can search/filter posts using keywords that match the post title and body.

- [x] Post list can be paginated.

## Demo

See the [public demo](https://golb.duong.work/) of the GOLB community!

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes

### Prerequisites

- Node.js 12.0+

- MongoDB 4.2.7+

- GitHub OAuth app. [Create here](https://github.com/settings/applications/new).

### Installing

Clone the repository:

```bash
git clone https://github.com/duongdev/golb.git
```

Enter the project directory:

```bash
cd golb
```

Install NPM dependencies:

```bash
yarn
```

Add `.env` files:

```bash
# packages/server/.env
GH_CLIENT_ID=     # GitHub app client ID
GH_CLIENT_SECRET= # GitHub app client secret
JWT_SECRET=       # JsonWebToken secret key
MONGO_URI=        # MongoDB server URI
```

```bash
# packages/web/.env
NEXT_PUBLIC_GH_CLIENT_ID= # GitHub app client ID
NEXT_PUBLIC_SERVER_URI=   # Address of the server
```

### Development

Run the development servers:

```bash
# Web
yarn workspace web dev
# Server
yarn workspace server watch:dev
```

Go to http://localhost:3000 to access the website and http://localhost:4000 to access express server.

### Production

Build the web and server:

```bash
# Web
yarn workspace web build
# Server
yarn workspace server build
```

Start the production servers:

```bash
# Web
yarn workspace web start
# Server
yarn workspace server start
```
