import { useEffect } from 'react';
import { useSelector } from 'react-redux';

const HeadManager = () => {
  const company = useSelector((state) => state.company.data);

  useEffect(() => {
    if (company) {
      // Set <title>
      document.title = company.company_name || 'Default Title';

      // Set favicon
      const existingFavicon = document.querySelector("link[rel='icon']");
      if (existingFavicon) {
        existingFavicon.href = company.favicon_logo;
      } else {
        const favicon = document.createElement('link');
        favicon.rel = 'icon';
        favicon.href = company.favicon_logo;
        document.head.appendChild(favicon);
      }

      // Set meta description
      let metaDesc = document.querySelector("meta[name='description']");
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.name = 'description';
        document.head.appendChild(metaDesc);
      }
      metaDesc.content = `Welcome to ${company.company_name}`;
    }
  }, [company]);

  return null;
};

export default HeadManager;
