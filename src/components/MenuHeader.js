import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getUserData, removeUserData } from '../Functions/Functions';

const MenuHeader = () => {
  const { t, i18n } = useTranslation();
  const [menuShow, setMenuShow] = useState();
  const [userFriend, setUserFriend] = useState();
  const [userFriendBusiness, setUserFriendBusiness] = useState();
  const [loader, setLoader] = useState(false);

  const [showLanguage, setShowLanguage] = useState(false);
  const [currentLanguage, setLanguage] = useState('en');
  const [user, setUser] = useState();

  const changeLanguage = (value) => {
    i18n
      .changeLanguage(value)
      .then(() => setLanguage(value))
      .catch((err) => console.log(err));
  };
  useEffect(async () => {
    const userData = await getUserData();
    if (userData) {
      setLoader(true);
      setUser(userData);
      // GetUsergiftData(userData);
    }

    //passing getData method to the lifecycle method
  }, []);

  const SearchFilter = (text) => {
    // this.setState({searchInput: true})
    const newData = userFriendSearch.filter((item) => {
      const itemData = `${item?.username?.toUpperCase()}`;
      const textData = text?.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    const newData1 = userFriendBusinessSearch.filter((item) => {
      const itemData = `${item?.username?.toUpperCase()}`;
      const textData = text?.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    setUserFriend(newData);
    setUserFriendBusiness(newData1);
  };

  return (
    <header class="row">
      <button class="btn btn-menu" onClick={() => setMenuShow(!menuShow)}>
        <img class="img-fluid" src="./images/menu-ico.svg" alt="ico" />
      </button>
      <div class="search-form">
        <input
          class="form-control"
          type="text"
          // placeholder="Search Friend"
          placeholder={t('placeHolders.Search')}
          onChange={(text) => {
            SearchFilter(text.target.value);
          }}
        />
      </div>
      <Link class="btn btn-home" to={'/home'}>
        <img class="img-fluid" src="./images/home-ico.svg" alt="" />
      </Link>

      {menuShow && (
        <div class="filter-sidebar head-dd main-menu show">
          <div class="filter-hdr">
            <div class="head">
              <button class="btn close" onClick={() => setMenuShow(!menuShow)}>
                <img src="images/close-ico.svg" alt="" />
              </button>
              <h4>{t('Menus.MAIN MENU')}</h4>
            </div>
          </div>
          <div class="filter-cont">
            <ul class="dropdown-menu">
              {user?.login_as == 'visitor' && (
                <li>
                  <Link class="dropdown-item" to={'/login'}>
                    <span class="d-flex align-items-center">{t('Menus.Login')}</span>
                    <img class="arrow" src="images/arrow_back_ios-24px.svg" />
                  </Link>
                </li>
              )}
              {(user?.login_as == 'manual' || user?.login_as == 'google' || user?.login_as == 'facebook') && (
                <>
                  <li>
                    <Link class="dropdown-item" to={'/userProfile'}>
                      <span class="d-flex align-items-center">{t('Menus.My User Page')}</span>
                      <img class="arrow" src="images/arrow_back_ios-24px.svg" />
                    </Link>
                  </li>
                  <li>
                    <Link class="dropdown-item" to={'/userProfile'}>
                      <span class="d-flex align-items-center">{t('Menus.My QR-CODE')}</span>
                      <img class="arrow" src="images/arrow_back_ios-24px.svg" />
                    </Link>
                  </li>
                  <li>
                    <Link class="dropdown-item" to={'/userFavourite'}>
                      <span class="d-flex align-items-center">{t('Menus.Favourites')}</span>
                      <img class="arrow" src="images/arrow_back_ios-24px.svg" />
                    </Link>
                  </li>
                  <li>
                    <Link class="dropdown-item" to="/UserGiftCollect" state={{ user_id: user?.user_id }}>
                      <span class="d-flex align-items-center">{t('Menus.Gift to be collected')}</span>
                      <img class="arrow" src="images/arrow_back_ios-24px.svg" />
                    </Link>
                  </li>
                  <li>
                    <Link class="dropdown-item" to={'/home'}>
                      <span class="d-flex align-items-center">{t('Menus.Block chat')}</span>
                      <img class="arrow" src="images/arrow_back_ios-24px.svg" />
                    </Link>
                  </li>
                </>
              )}
              <li>
                <button
                  class="dropdown-item bg-transparent  w-full"
                  onClick={() => {
                    setShowLanguage(!showLanguage);
                    setMenuShow(false);
                  }}
                >
                  <span class="d-flex align-items-center">
                    {t('Menus.Language')} ({currentLanguage})
                  </span>
                  <img class="arrow" src="images/arrow_back_ios-24px.svg" />
                </button>
              </li>

              <li>
                <a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#how-it-modal">
                  <span class="d-flex align-items-center">{t('Menus.Help')}</span>
                  <img class="arrow" src="images/arrow_back_ios-24px.svg" />
                </a>
              </li>
              <li>
                <a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#how-it-modal-1">
                  <span class="d-flex align-items-center">{t('Menus.Third-Party Licenses')}</span>
                  <img class="arrow" src="images/arrow_back_ios-24px.svg" />
                </a>
              </li>
              {(user?.login_as == 'manual' || user?.login_as == 'google' || user?.login_as == 'facebook') && (
                <>
                  <li>
                    <Link to={'/login'} class="dropdown-item">
                      <span class="d-flex align-items-center">{t('Menus.Change email - password')}</span>
                      <img class="arrow" src="images/arrow_back_ios-24px.svg" />
                    </Link>
                  </li>
                  <li>
                    <Link to={'/splash'} onClick={() => removeUserData()} class="dropdown-item">
                      <span class="d-flex align-items-center">{t('Menus.Log-out')}</span>
                      <img class="arrow" src="images/arrow_back_ios-24px.svg" />
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      )}
      {showLanguage && (
        <div class="filter-sidebar head-dd main-menu show">
          <div class="filter-hdr">
            <div class="head">
              <button class="btn close" onClick={() => setShowLanguage(!showLanguage)}>
                <img src="./images/close-ico.svg" alt="" />
              </button>
              <h4>{t('Menus.SELECT LANGUAGE')}</h4>
            </div>
          </div>
          <div class="filter-cont">
            <ul class="dropdown-menu">
              <li>
                <button
                  class="dropdown-item bg-transparent w-full"
                  onClick={() => {
                    changeLanguage('en');
                    setShowLanguage(false);
                  }}
                >
                  <span class="d-flex align-items-center">{t('Menus.English')}</span>
                  <img class="arrow" src="./images/arrow_back_ios-24px.svg" />
                </button>
              </li>
              <li>
                <button
                  class="dropdown-item bg-transparent w-full"
                  onClick={() => {
                    changeLanguage('hi');
                    setShowLanguage(false);
                  }}
                >
                  <span class="d-flex align-items-center">{t('Menus.italian')}</span>
                  <img class="arrow" src="./images/arrow_back_ios-24px.svg" />
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}
    </header>
  );
};

export default MenuHeader;
