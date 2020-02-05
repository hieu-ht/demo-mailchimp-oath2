import Link from "next/link";
import axios from "axios";

const Index = () => (
  <div>
    <Link href="/about">
      <a>About page</a>
    </Link>
    <p>Hello Next.js</p>
    <form method="POST" action="http://127.0.0.1:3000/login">
      <button type="submit">Login</button>
    </form>
    <form
      method="POST"
      action="http://127.0.0.1:3000/oauth/mailchimp/actions/test"
    >
      <button type="submit">Direct test</button>
    </form>
    <a href="http://127.0.0.1:3000/session_debug">Debug session</a>
    <br />
    <a href="http://127.0.0.1:3000/oauth/mailchimp?code=bbb592f55e6593024fb803ed7c3bf9c4">
      Oauth test
    </a>
    <br />
    <a href="https://login.mailchimp.com/oauth2/authorize?response_type=code&client_id=781715608741&redirect_uri=http%3A%2F%2F127.0.0.1%3A3000%2Foauth%2Fmailchimp">
      mailchimp login
    </a>
  </div>
);

export default Index;
