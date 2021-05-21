import React, { useState, useEffect } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import './Home.css';


const Home = () => {
  const history = useHistory();
  const [states, setStates] = useState([]);

  useEffect(() => {
    fetch("https://api.covid19india.org/state_district_wise.json")
      .then(res => res.json())
      .then(results => {
        const temp = [];

        for (const result in results) {
          temp.push(result);
        }
        setStates(temp);
      })
  }, [])

  const onhandleClick = (idx) => {
    history.push(`/state/q?state=${states[idx]}`);
  }


  return (
    <IonPage className = "home">
      <IonHeader>
        <IonToolbar color="dark">
          <IonTitle className="ion-text-center ion-text-uppercase">Corona Tracker</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <img src="https://static.businessworld.in/article/article_extra_large_image/1585367442_yC03Ww_Self_care_during_Corona.jpg"/>
        <IonList>
          {
            states && states.map((state, i) => (
              <IonItem  className = "home__items" key = {i} onClick={() => onhandleClick(i)}>
                <p className = "home__text">{state}</p>
              </IonItem>
            ))
          }
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Home;
