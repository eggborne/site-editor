import { FC } from "react";
import './Header.css';

interface HeaderProps {
  ready: boolean;
  currentUser: any;
  signUserOut: () => void;
}

const Header: FC<HeaderProps> = ({ ready, currentUser, signUserOut }) => {
  return (
    <header>
      <h1>Site Editor 🐪</h1>
      {ready ?
        currentUser &&
        <div className='user-info'>
          {currentUser.displayName || currentUser.email}
            {currentUser.photoURL ?
              <div className={'user-avatar'} style={{ backgroundImage: `url(${currentUser.photoURL})` || `` }} />
            :
            <div className={'user-avatar'}>👤</div>
          }
          <button onClick={signUserOut} type='button' className='sign-out-button'>Sign Out</button>
        </div>
        :
        <div>loading...</div>
      }
    </header>
  );
};

export default Header;