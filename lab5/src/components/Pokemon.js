import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Spinner, Jumbotron } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import Page404 from './Page404';

export default function Pokemon(props) {
  const { id } = useParams();
  const [pokemonData, setPokemonData] = useState(undefined);
  const [isFetching, setIsFetching] = useState(true);
  const [notFound, setNotFound] = useState(true);
  useEffect(() => {
    async function fetchData() {
      setIsFetching(true);
      try {
        const { data: pokemon } = await axios.get(
          `https://pokeapi.co/api/v2/pokemon/${id}`
        );
        setPokemonData(pokemon);
        if (pokemonData === undefined) {
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
  }, [id, pokemonData]);
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
            {pokemonData.name.charAt(0).toUpperCase() +
              pokemonData.name.slice(1)}
          </h1>
          <p className="custom-txt">
            Types:{' '}
            <ul>
              {pokemonData.types.map((type, index) => {
                return (
                  <li key={index}>
                    {type.type.name.charAt(0).toUpperCase() +
                      type.type.name.slice(1)}
                  </li>
                );
              })}
            </ul>
          </p>
          <p className="custom-txt">
            Abilities:
            <ul>
              {pokemonData.abilities.map((ability, index) => {
                return (
                  <li key={index}>
                    {ability.ability.name
                      .split('-')
                      .map(
                        (abilityWord) =>
                          abilityWord.charAt(0).toUpperCase() +
                          abilityWord.slice(1)
                      )
                      .join(' ')}
                  </li>
                );
              })}
            </ul>
          </p>
          <p className="custom-txt">
            Moves:
            <ul>
              {pokemonData.moves.map((move, index) => {
                return (
                  <li key={index}>
                    {move.move.name
                      .split('-')
                      .map(
                        (moveWord) =>
                          moveWord.charAt(0).toUpperCase() + moveWord.slice(1)
                      )
                      .join(' ')}
                  </li>
                );
              })}
            </ul>
          </p>
        </Jumbotron>
      </div>
    );
  }
}
