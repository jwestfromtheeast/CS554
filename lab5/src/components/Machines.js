import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Spinner, Jumbotron } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import Page404 from './Page404';

export default function Machines(props) {
  const { id } = useParams();
  const [machineData, setMachineData] = useState(undefined);
  const [isFetching, setIsFetching] = useState(true);
  const [notFound, setNotFound] = useState(true);
  useEffect(() => {
    async function fetchData() {
      setIsFetching(true);
      try {
        const { data: machine } = await axios.get(
          `https://pokeapi.co/api/v2/machine/${id}`
        );
        setMachineData(machine);
        if (machineData === undefined) {
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
  }, [id, machineData]);
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
            {machineData.move.name
              .split('-')
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ')}
          </h1>
          <p className="custom-txt">
            Machine Number: {machineData.item.name.toUpperCase()}
          </p>
          <p className="custom-txt">
            Game Version:{' '}
            {machineData.version_group.name.charAt(0).toUpperCase() +
              machineData.version_group.name.slice(1)}
          </p>
        </Jumbotron>
      </div>
    );
  }
}
