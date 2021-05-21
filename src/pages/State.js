import React, { useState, useEffect } from 'react';
import {IonCardContent, IonContent, IonHeader, IonPage, IonRow, IonTitle, IonToolbar, IonList, IonItem, IonCard, IonCardHeader, IonCardTitle, IonButtons, IonBackButton, IonCol} from '@ionic/react';

import { useLocation, useHistory } from 'react-router-dom';
import queryString from 'query-string';
import './State.css';

function State() {

    const history = useHistory();
    const [districts, setDistricts] = useState([]);
    const [stateName, setStateName] = useState("")
    const [info, setInfo] = useState({});
    const { search } = useLocation();

    useEffect(() => {
        const { state } = queryString.parse(search);

        if (state === undefined || state === null) {
            history.push('/');
            return;
        }
        
        setStateName(state);        
        
        fetch("https://api.covid19india.org/state_district_wise.json")
          .then(res => res.json())
            .then(results => {

                if (results[state] === null || results[state] === undefined) {
                    alert('Invalid Result Please Try Again');
                    history.push('/');
                    return;
                }


              const temp = [];
              const info = {
                active: 0,
                confirmed: 0,
                deceased: 0,
                recovered: 0,
              }
              
              for (const result in results[state].districtData) {
                  
                  info.active += results[state].districtData[result].active
                  info.confirmed += results[state].districtData[result].confirmed;
                  info.deceased += results[state].districtData[result].deceased;
                  info.recovered += results[state].districtData[result].recovered;
                    
                  temp.push(result);
              }
              
              setDistricts(temp);
              setInfo(info)
          })
        
      }, [])

    const onHandleClick = (idx) => {
        history.push(`/district/q?state=${stateName}&district=${districts[idx]}`);
    }
    

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color="dark">
                    <IonButtons slot="start">
                        <IonBackButton defaultHref= '/' />
                    </IonButtons>
                    <IonTitle className="ion-text-center ion-text-uppercase">{ stateName }</IonTitle>
                </IonToolbar>

            </IonHeader>
            <IonContent>
                <IonRow>
                    <IonCol>
                        <IonCard color="warning">
                            <IonCardHeader>
                                <IonCardTitle className="ion-text-center"> Active </IonCardTitle>
                            </IonCardHeader>
                            <IonCardContent className="ion-text-center">
                                {info.active}
                            </IonCardContent>
                        </IonCard>
                    </IonCol>

                
                    <IonCol>
                        <IonCard color="danger">
                            <IonCardHeader>
                                <IonCardTitle className="ion-text-center"> Confirmed </IonCardTitle>
                            </IonCardHeader>
                            <IonCardContent className="ion-text-center">
                                {info.confirmed}
                            </IonCardContent>
                        </IonCard>
                    </IonCol>
                
                    <IonCol>
                        <IonCard color= "medium">
                            <IonCardHeader>
                                <IonCardTitle className="ion-text-center"> Deceased </IonCardTitle>
                            </IonCardHeader>
                            <IonCardContent className="ion-text-center">
                                    {info.deceased}
                            </IonCardContent>
                        </IonCard>
                    </IonCol>

                    <IonCol>

                        <IonCard color="success">
                            <IonCardHeader>
                                <IonCardTitle className="ion-text-center"> Recovered </IonCardTitle>
                            </IonCardHeader>
                            <IonCardContent className="ion-text-center">
                                    {info.recovered}
                            </IonCardContent>
                        </IonCard>
                    </IonCol>
                </IonRow>
                
                <IonList className="ion-text-center">
                {
                    districts && districts.map((state, i) => (
                    <IonItem  className="home__items" key = {i} onClick={() => onHandleClick(i)}>
                        <p>{state}</p>
                    </IonItem>
                    ))
                }
                </IonList>
            </IonContent>
        </IonPage>
    )
}

export default State;
