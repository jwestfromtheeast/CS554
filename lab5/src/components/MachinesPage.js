import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pagination, Spinner, Jumbotron } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import Page404 from './Page404';

export default function MachinesPage(props) {
  const { page } = useParams();
  const [machinePageData, setMachinePageData] = useState(undefined);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [notFound, setNotFound] = useState(true);

  const parseId = (str) => {
    const len = str.length;
    switch (len) {
      case 36:
        return str.substring(34, 35);
      case 37:
        return str.substring(34, 36);
      case 38:
        return str.substring(34, 37);
      case 39:
        return str.substring(34, 38);
      default:
        return;
    }
  };

  useEffect(() => {
    let unmounted = false;
    let source = axios.CancelToken.source();
    axios
      .get(`https://pokeapi.co/api/v2/machine/?offset=${page * 20}&limit=20`, {
        cancelToken: source.token,
        timeout: 5000,
      })
      .then((a) => {
        if (!unmounted) {
          setMachinePageData(a.data);
          setLoading(false);
        }
      })
      .catch(function (e) {
        if (!unmounted) {
          setError(true);
          setErrorMessage(e.message);
          setLoading(false);
          if (axios.isCancel(e)) {
            console.log(`Request cancelled:${e.message}`);
          } else {
            console.log('Another error happened ' + e.message);
          }
        }
      });
    if (machinePageData === undefined || machinePageData.results.length === 0) {
      setNotFound(true);
    } else {
      setNotFound(false);
    }
    return function () {
      unmounted = true;
      source.cancel('Cancelling in cleanup');
    };
  }, [page, machinePageData]);
  if (loading) {
    return (
      <div className="spin-border">
        <Spinner className="spin" animation="border" variant="danger" />
      </div>
    );
  } else if (notFound) {
    return <Page404 />;
  } else {
    if (parseInt(page) === 0) {
      return (
        <div>
          <Jumbotron className="bg">
            <h1 className="custom-header">Machines</h1>
            <ul className="custom-txt">
              {machinePageData.results.map((machine, index) => {
                return (
                  <li key={index}>
                    <Link to={`/machines/${parseId(machine.url)}`}>
                      {parseId(machine.url)}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <Pagination>
              <Pagination.Item aria-label="Current Page">{0}</Pagination.Item>
              <LinkContainer to="/machines/page/1">
                <Pagination.Next></Pagination.Next>
              </LinkContainer>
            </Pagination>
          </Jumbotron>
        </div>
      );
    } else {
      return (
        <div>
          <Jumbotron className="bg">
            <h1 className="custom-header">Machines</h1>
            <ul className="custom-txt">
              {machinePageData.results.map((machine, index) => {
                return (
                  <li key={index}>
                    <Link to={`/machines/${parseId(machine.url)}`}>
                      {parseId(machine.url)}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <Pagination>
              <LinkContainer to={`/machines/page/${parseInt(page) - 1}`}>
                <Pagination.Prev></Pagination.Prev>
              </LinkContainer>
              <Pagination.Item aria-label="Current Page">
                {parseInt(page)}
              </Pagination.Item>
              <LinkContainer to={`/machines/page/${parseInt(page) + 1}`}>
                <Pagination.Next></Pagination.Next>
              </LinkContainer>
            </Pagination>
          </Jumbotron>
        </div>
      );
    }
  }
}
