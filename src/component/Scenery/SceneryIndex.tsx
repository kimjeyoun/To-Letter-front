import { useEffect, useState } from "react";
import TimeBackground from "./TimeBackground";
import SeasonBackground from "./SeasonBackground";
import WeatherBackground from "./WeatherBackground";
import { getCurrentWeather } from "../../utils/weatherApi";

export interface locationI{
  lat:	number
  lng:	number
}

const SceneryIndex = () => {
  const [now, setNow] = useState<Date>(new Date());
  const [weatherInfo, setWeatherInfo] =useState<any>("")

  const getWeather = async ({lat, lng}: { lat: number; lng: number; })=>{
    const data = await getCurrentWeather({lat:lat, lng:lng, key: process.env.REACT_APP_OPENWEATHERMAP_API_KEY});
    // setWeatherInfo(data.weather[0].main)
    setWeatherInfo("Rain")

  }


  useEffect(()=>{
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          getWeather({ lat: latitude, lng: longitude });
        },
        (error) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              alert('사용자가 위치 정보 제공을 거부했습니다.');
              break;
            case error.POSITION_UNAVAILABLE:
              alert('위치 정보를 사용할 수 없습니다.');
              break;
            case error.TIMEOUT:
              alert('위치 정보 요청이 시간 초과되었습니다.');
              break;
            default:
              alert('알 수 없는 오류가 발생했습니다.');
              break;
          }
        })
    } else {
      alert('이 브라우저는 위치 정보를 지원하지 않습니다.');
    }
  },[])
  return (
    <>
      {/* <TimeBackground nowHoursValue={now.getHours()}/>
      <SeasonBackground nowMonthValue={now.getMonth()} weatherInfo={weatherInfo} /> */}
      <TimeBackground nowHoursValue={12}/>
      <SeasonBackground nowMonthValue={4} weatherInfo={weatherInfo} />
      {
        weatherInfo !=="" && <WeatherBackground weatherInfo={weatherInfo} />
      }
    </>
  );
};

export default SceneryIndex;
