import React, { useState, useEffect } from 'react';
import {IonCardContent, IonContent, IonHeader, IonPage, IonRow, IonTitle, IonToolbar, IonList, IonItem, IonCard, IonCardHeader, IonCardTitle, IonButtons, IonBackButton, IonCol} from '@ionic/react';
import { useLocation, useHistory } from 'react-router-dom';
import queryString from 'query-string';
import { Bar } from 'react-chartjs-2';
import './District.css';

function District() {
    const history = useHistory();
    const [info, setInfo] = useState({});
    const [dataList, setDataList] = useState([]);
    const [stateName, setStateName] = useState("")
    const [districtName, setDistrictName] = useState("")
    
    const { search } = useLocation();

    const labels = ['Active', 'Confirm', 'Migrated', 'Deceased', 'Recovered'];

    useEffect(() => {
        const { state, district } = queryString.parse(search);

        setStateName(state);
        setDistrictName(district);

        if (state === undefined || state === null || district === undefined || district === null) {
            history.push('/');
            return;
        }
        
        fetch("https://api.covid19india.org/state_district_wise.json")
          .then(res => res.json())
            .then(results => {

                if (results[state] === null || results[state] === undefined || results[state].districtData[district] === null || results[state].districtData[district] === undefined) {
                    alert('Invalid Result Please Try Again');
                    history.push('/');
                    return;
                }

                const info = {
                    active: results[state].districtData[district].active,
                    confirmed: results[state].districtData[district].confirmed,
                    deceased: results[state].districtData[district].deceased,
                    recovered: results[state].districtData[district].recovered,
                    migratedother: results[state].districtData[district].migratedother,
                }

                setInfo(info);
            })    
    }, [])


    const charData = {
        labels: labels,
        datasets: [
          {
            label: 'Active',
            data: [info.active, info.confirmed, info.migratedother, info.deceased, info.recovered],
            backgroundColor: [
              '#ffc409',
              '#eb445a',
              'rgba(255, 206, 86, 0.2)',
              '#92949c',
              '#2dd36f',
            ],
            borderColor: [
              '#ffc409',
              '#eb445a',
              'rgba(255, 206, 86, 1)',
              '#92949c',
              '#2dd36f',
            ],
            borderWidth: 1,
          },
        ],
    };

    const options = {
        indexAxis: 'x',
        
        elements: {
            bar: {
            borderWidth: 2,
            },
        },
        responsive: true,
        plugins: {
            legend: {
            position: 'right',
            },
            title: {
            display: true,
            text: `Number of cases in ${districtName}`,
            },
        },
      };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color="dark" className="ion-text-center ion-text-uppercase">
                <IonButtons slot="start">
                    <IonBackButton defaultHref= {`/state/q?state=${stateName}`} />
                </IonButtons>
                    <IonTitle>{ districtName }</IonTitle>
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
            
            
                {dataList.map((items) => (
                    <IonItem>
                        <p>{ items }</p>
                    </IonItem>
                ))}

                <Bar data= {charData} options={options} width={6} height={4} />
            </IonContent>
        </IonPage>
    )
}

export default District
