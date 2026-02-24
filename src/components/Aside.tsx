import CalendarWidget from "./widgets/CalendarWidget";
///import WeatherWidget from "./widgets/WeatherWidget";
///import CurrencyWidget from "./widgets/CurrencyWidget";
import FacebookWidget from "./widgets/FacebookWidget";
import TelegramWidget from "./widgets/TelegramWidget";
///import NewsletterWidget from "./widgets/NewsletterWidget";
import AdBanner from "./AdBanner";

const Aside = () => {
  return (
    <aside>
      <FacebookWidget />
        <AdBanner position="asideadds" />

      <AdBanner position="aside" />
            <TelegramWidget />

      <CalendarWidget />
    </aside>
  );
};

export default Aside;
