interface FirebaseSchema {
  clients: {
    [userId: string
    ]: {
      editorSettings: {
        darkMode: boolean;
      };
    };
  };
  sites: {
    [siteId: string
    ]: {
      authorizedUsers: {
        [userId: string
        ]: boolean;
      };
      siteUrl: string;
      prod: {
        "--footer-height": string;
        "--hamburger-animation-duration": string;
        "--hamburger-size": string;
        "--header-bg-color": string;
        "--header-height": string;
        "--main-bg-color": string;
        "--main-font": string;
        "--main-font-color": string;
        "--main-font-size": string;
        "--main-padding-horiz": string;
        "--main-padding-vert": string;
        "--nav-area-bg-color": string;
        "--nav-area-font": string;
        "--nav-area-font-color": string;
        "--nav-area-font-size": string;
        "--nav-padding-horiz": string;
        "--nav-padding-vert": string;
        "--nav-text-shadow-blur": string;
        "--nav-text-shadow-color": string;
        "--nav-text-shadow-x": string;
        "--nav-text-shadow-y": string;
        "--text-accent-color": string;
        "--title-font": string;
      };
      test: {
        // Same structure as prod
      };
    };
  };
}