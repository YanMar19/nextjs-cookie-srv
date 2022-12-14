import { API_URL } from '../../config/index'
import cookie from 'cookie'

const register = async (req, res) => {
  if (req.method === 'POST') {

    const {fullname, email, password} = req.body

    const apiRes = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fullname,
        email,
        password
      }),
    })

    const resData = await apiRes.json()

    // console.log(resData.data.token)

    if (apiRes.ok) {
      // Set Cookie
      res.setHeader(
        'Set-Cookie',
        cookie.serialize('x-access-token', String(resData.data.token), {
          httpOnly: true,
          secure: process.env.NODE_ENV !== 'development',
          maxAge: 60 * 60 * 24 * 7, // 1 week
          sameSite: 'strict',
          path: '/'
        })
      )

      res.status(200).json({ user: resData.data })
    } else {
      res.status(500).json({message: resData.message})
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).json({ message: `Method ${req.method} not allowed` })
  }
}


export default register