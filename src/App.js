import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import { calculateRank, calculateRating, getHighscores } from './statsUtils.js';


function App() {
  const [stats, setStats] = useState(null);

  let user;
  let perms;

  let kills;
  let deaths;
  let wins;
  let losses;
  let totalRounds;
  let ballistick;
  let kd;
  let wl;
  let akpr;
  let adpr;
  let roundsCompleted;
  let roundsForfeited;
  let rcperc;
  let rfperc;
  let esthrs;
  let rating;
  let rank;
  let highscoreRank;

  const handleSubmit = async () => {
    try {
      const username = document.getElementById('userInput').value;
      const response = await axios.get(`https://corsproxy.io/?http://api.xgenstudios.com/?method=xgen.stickarena.stats.get&username=${username}`);
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(response.data, 'text/xml');
      const userNode = xmlDoc.querySelector('user');

      const usernameExists = userNode.getAttribute('username') !== '';
    
      if (!usernameExists) {
        console.log('Username does not exist');
        setStats(null);
        return;
      }

      console.log(response.data);

      setStats({
        username: userNode.getAttribute('username'),
        perms: userNode.getAttribute('perms'),
        stats: {
          wins: userNode.querySelector('stat[id="wins"]').textContent,
          losses: userNode.querySelector('stat[id="losses"]').textContent,
          kills: userNode.querySelector('stat[id="kills"]').textContent,
          deaths: userNode.querySelector('stat[id="deaths"]').textContent,
          rounds: userNode.querySelector('stat[id="rounds"]').textContent,
          ballistick: userNode.querySelector('stat[id="ballistick"]').textContent,
        }
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  
  if(stats) {
    user = stats.username;
    perms = stats.perms;

    kills = stats.stats.kills;
    deaths = stats.stats.deaths;
    wins = stats.stats.wins;
    losses = stats.stats.losses;
    totalRounds = stats.stats.rounds;
    ballistick = stats.stats.ballistick;

    roundsCompleted = parseInt(wins) + parseInt(losses);
    roundsForfeited = parseInt(totalRounds) - parseInt(roundsCompleted);

    rcperc = (roundsCompleted / parseInt(totalRounds) * 100).toFixed(0);
    rfperc = (roundsForfeited / parseInt(totalRounds) * 100).toFixed(0);

    if (!parseInt(totalRounds)) {
      rcperc = 0
      rfperc = 0;
    }

    akpr = (parseInt(kills) / roundsCompleted).toFixed(2);
    adpr = (parseInt(deaths) / roundsCompleted).toFixed(2);

    esthrs = ((roundsCompleted * 5 + 1 / 3 * (roundsForfeited * 5)) / 60).toFixed(0);

    if(roundsCompleted === 0)
    {
        akpr = 0;
        adpr = 0;
    }

    kd = (parseInt(kills) / parseInt(deaths)).toFixed(2);
    wl = (parseInt(wins) / parseInt(losses)).toFixed(2);

    if (deaths === '0') {
        kd = (parseInt(kills) / 1).toFixed(2);
    }

    if (losses === '0') {
        wl = (parseInt(wins) / 1).toFixed(2);
    }

    rank = calculateRank(parseInt(kills));
    rating = calculateRating(kd, rank);

    highscoreRank = getHighscores(user.toLowerCase());
  }

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="App">
      <div className="input-container">
        <input id="userInput" type="text" placeholder="Enter username" onKeyPress={handleKeyPress}/>
        <button id="btn" onClick={handleSubmit}>Generate</button>
      </div>
      <div className="statgen-container">
        {stats ? (
          <div className="Username">
            {user ? user : "Account does not exist"}
          </div>
        ) : (
          <div className="Username">
            Account does not exist
          </div>
        )}

        {stats && (
          <div className="stats-container">

            <div className="StatsFirst">
              <p>Kills: {kills}</p>
              <p>Deaths: {deaths}</p>
              <p>Wins: {wins}</p>
              <p>Losses: {losses}</p>
            </div>

            <div className="StatsSecond">
              <p>K/D: {kd}</p>
              <p>W/L: {wl}</p>
              <p>Avg. KPR: {akpr}</p>
              <p>Avg. DPR: {adpr}</p>
            </div>

            <div className="StatsThird">
              <p>Total Rounds: {totalRounds}</p>
              <p>Rounds Completed: {roundsCompleted} ({rcperc}%)</p>
              <p>Rounds Forfeited: {roundsForfeited} ({rfperc}%)</p>
              <p>Est. Hours Played: {esthrs}</p>
            </div>
          </div>
        )}

        {stats && kills >= 5 && (
          <div className="rank-container">
            <img src={`ranks/${rank}.gif`} alt="Rank" />
          </div>
        )}

        {stats && ballistick === '1' && (
          <div className="labpass-container">
            <img src={`ranks/lp.gif`} alt="lp" />
          </div>
        )}

        {stats && perms >= 1 && (
          <div className="mod-container">
            <img src={`ranks/mod.gif`} alt="lp" />
          </div>
        )}

        {stats && perms === '-1' && (
          <div className="banned-container">
            <img src={`other/banned.png`} alt="banned" />
          </div>
        )}

        {stats && (
          <div className="stickman-container">
            <img src={`other/stickman.gif`} alt="stickman" />
          </div>
        )}

        {stats && (
          <div className="stickEyes-container">
            <img src={`other/eyes.gif`} alt="stickeyes" />
          </div>
        )}

        {stats && (
          <div className="rating-container">
            {rating}
          </div>
        )}

        {stats && highscoreRank != null && (
          <div className="medal-container">
            <img src={`other/medal.gif`} alt="medal" />
          </div>
        )}

        {stats && highscoreRank != null && (
          <div className="highscore-container">
            #{highscoreRank} Overall
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
