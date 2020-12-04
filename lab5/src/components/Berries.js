import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Spinner, Jumbotron } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import Page404 from './Page404';

export default function Berries(props) {
  const { id } = useParams();
  const [berryData, setBerryData] = useState(undefined);
  const [isFetching, setIsFetching] = useState(true);
  const [notFound, setNotFound] = useState(true);
  useEffect(() => {
    async function fetchData() {
      setIsFetching(true);
      try {
        const { data: berry } = await axios.get(
          `https://pokeapi.co/api/v2/berry/${id}`
        );
        setBerryData(berry);
        if (berryData === undefined) {
          setNotFound(true);
        } else {
          setNotFound(false);
        }
      } catch (e) {
        console.log(e);
      }
      setIsFetching(false);
    }
    fetchData();
  }, [id, berryData]);
  if (isFetching) {
    return (
      <div className="spin-border">
        <Spinner className="spin" animation="border" variant="danger" />
      </div>
    );
  } else if (notFound) {
    return <Page404 />;
  } else {
    return (
      <div>
        <Jumbotron className="bg">
          <h1 className="custom-header">
            {berryData.name.charAt(0).toUpperCase() + berryData.name.slice(1)}{' '}
            Berry
          </h1>
          <p className="custom-txt">
            Firmness:{' '}
            {berryData.firmness.name.charAt(0).toUpperCase() +
              berryData.firmness.name.slice(1)}
          </p>
          <p className="custom-txt">
            Flavors:
            <ul>
              {berryData.flavors.map((flavorItem, index) => {
                return (
                  <li key={index}>
                    {flavorItem.flavor.name.charAt(0).toUpperCase() +
                      flavorItem.flavor.name.slice(1)}
                  </li>
                );
              })}
            </ul>
          </p>
          <p className="custom-txt">Growth Time: {berryData.growth_time}</p>
          <p className="custom-txt">
            Max Harvest Amount: {berryData.max_harvest}
          </p>
          <p className="custom-txt">Size: {berryData.size}</p>
          <p className="custom-txt">Smoothness: {berryData.smoothness}</p>
          <p className="custom-txt">Soil Dryness: {berryData.soil_dryness}</p>
        </Jumbotron>
      </div>
    );
  }
}
