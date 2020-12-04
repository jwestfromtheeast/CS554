import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pagination, Spinner, Jumbotron } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import Page404 from './Page404';

export default function BerriesPage(props) {
  const { page } = useParams();
  const [berriesPageData, setBerriesPageData] = useState(undefined);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [notFound, setNotFound] = useState(true);

  const parseId = (str) => {
    const len = str.length;
    switch (len) {
      case 34:
        return str.substring(32, 33);
      case 35:
        return str.substring(32, 34);
      case 36:
        return str.substring(32, 35);
      case 37:
        return str.substring(32, 36);
      default:
        return;
    }
  };

  useEffect(() => {
    let unmounted = false;
    let source = axios.CancelToken.source();
    axios
      .get(`https://pokeapi.co/api/v2/berry/?offset=${page * 20}&limit=20`, {
        cancelToken: source.token,
        timeout: 5000,
      })
      .then((a) => {
        if (!unmounted) {
          setBerriesPageData(a.data);
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
    if (berriesPageData === undefined || berriesPageData.results.length === 0) {
      setNotFound(true);
    } else {
      setNotFound(false);
    }
    return function () {
      unmounted = true;
      source.cancel('Cancelling in cleanup');
    };
  }, [page, berriesPageData]);
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
            <h1 className="custom-header">Berries</h1>
            <ul className="custom-txt">
              {berriesPageData.results.map((berries, index) => {
                return (
                  <li key={index}>
                    <Link to={`/berries/${parseId(berries.url)}`}>
                      {berries.name.charAt(0).toUpperCase() +
                        berries.name.slice(1)}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <Pagination>
              <Pagination.Item aria-label="Current Page">{0}</Pagination.Item>
              <LinkContainer to="/berries/page/1">
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
            <h1 className="custom-header">Berries</h1>
            <ul className="custom-txt">
              {berriesPageData.results.map((berries, index) => {
                return (
                  <li key={index}>
                    <Link to={`/berries/${parseId(berries.url)}`}>
                      {berries.name.charAt(0).toUpperCase() +
                        berries.name.slice(1)}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <Pagination>
              <LinkContainer to={`/berries/page/${parseInt(page) - 1}`}>
                <Pagination.Prev></Pagination.Prev>
              </LinkContainer>
              <Pagination.Item aria-label="Current Page">
                {parseInt(page)}
              </Pagination.Item>
              <LinkContainer to={`/berries/page/${parseInt(page) + 1}`}>
                <Pagination.Next></Pagination.Next>
              </LinkContainer>
            </Pagination>
          </Jumbotron>
        </div>
      );
    }
  }
}
