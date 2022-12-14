import { API_URL} from '../../config/index';
import cookie from 'cookie';

export default async (req, res) => {

  // checking if is a post request
  if(req.method === 'POST') {
    // destructure username, and password
    const { username, password } = req.body

    // Making a post request to hit our backend api-endpoint
    const apiRes = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username,
        password
      })
    })

    const resData = await apiRes.json()
console.log(resData.data.username);

    if(apiRes.ok && resData.statusCode === 200 ) {

      //Set Cookie
      res.setHeader(
        'Set-Cookie',
        cookie.serialize('x_access_token', String(resData.data.token), {
          httpOnly: true,
          secure: process.env.NODE_ENV !== 'development',
          //maxAge: 60 * 60 * 24, // 1 day
          sameSite: 'strict',
          path: '/'
        })
      )
      //console.log(resData.user);
      res.status(200).json({user: true})
      //console.log(res)
    } else {
      res.status(resData.statusCode).json({message: resData.message})
    }

  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).json({message: `Method ${req.method} not allowed`})
  }
}