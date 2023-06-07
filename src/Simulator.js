import React, { useState, useEffect } from 'react';
import { Row, Col, Container, FormSelect, Table } from "react-bootstrap";

const SoccerGroupStage = () => {
    const [teamNames, setTeamNames] = useState(["Boca", "Dep. Pereira", "Colo Colo", "Monagas"]);

    const [fixtures, setFixtures] = useState([
      { homeTeam: "Dep. Pereira", awayTeam: "Colo Colo", homeGoals: null, awayGoals: null },
      { homeTeam: "Monagas", awayTeam: "Boca", homeGoals: null, awayGoals: null },
      { homeTeam: "Boca", awayTeam: "Dep. Pereira", homeGoals: null, awayGoals: null },
      { homeTeam: "Colo Colo", awayTeam: "Monagas", homeGoals: null, awayGoals: null },
      { homeTeam: "Colo Colo", awayTeam: "Boca", homeGoals: null, awayGoals: null },
      { homeTeam: "Dep. Pereira", awayTeam: "Monagas", homeGoals: null, awayGoals: null },
      { homeTeam: "Monagas", awayTeam: "Colo Colo", homeGoals: null, awayGoals: null },
      { homeTeam: "Boca", awayTeam: "Dep. Pereira", homeGoals: null, awayGoals: null },
      { homeTeam: "Dep. Pereira", awayTeam: "Monagas", homeGoals: null, awayGoals: null },
      { homeTeam: "Boca", awayTeam: "Colo Colo", homeGoals: null, awayGoals: null },
      { homeTeam: "Monagas", awayTeam: "Boca", homeGoals: null, awayGoals: null },
      { homeTeam: "Colo Colo", awayTeam: "Dep. Pereira", homeGoals: null, awayGoals: null },
    ]);
    console.log(fixtures)
    
    const [standings, setStandings] = useState([]);
  
    useEffect(() => {
      generateFixtures();
    }, [teamNames]);
  
    useEffect(() => {
      updateStandings();
    }, [fixtures]);
  
    const generateFixtures = () => {
        const newFixtures = [];
        const numTeams = teamNames.length;
      
        for (let i = 0; i < numTeams; i++) {
          for (let j = i + 1; j < numTeams; j++) {
            const homeTeam = teamNames[i];
            const awayTeam = teamNames[j];
      
            // First leg match
            newFixtures.push({ homeTeam, awayTeam, homeGoals: null, awayGoals: null });
      
            // Second leg match (reverse home and away)
            newFixtures.push({ homeTeam: awayTeam, awayTeam: homeTeam, homeGoals: null, awayGoals: null });
          }
        }
      
        // Assign the correct order property to fixtures
        const fixturesWithOrder = newFixtures.map((fixture, index) => ({
          ...fixture,
          order: index + 1,
        }));
      
        setFixtures(fixturesWithOrder);
      };
      
      const updateStandings = () => {
        const newStandings = teamNames.map((team) => ({
          name: team,
          played: 0,
          gamesWon: 0,
          gamesDrawn: 0,
          gamesLost: 0,
          goalsFor: 0,
          goalsAgainst: 0,
          goalDifference: 0,
          points: 0,
        }));
      
        fixtures.forEach((fixture) => {
          const homeTeam = newStandings.find((team) => team.name === fixture.homeTeam);
          const awayTeam = newStandings.find((team) => team.name === fixture.awayTeam);
      
          if (fixture.homeGoals !== null && fixture.awayGoals !== null) {
            homeTeam.played += 1;
            awayTeam.played += 1;
      
            homeTeam.goalsFor += fixture.homeGoals;
            homeTeam.goalsAgainst += fixture.awayGoals;
      
            awayTeam.goalsFor += fixture.awayGoals;
            awayTeam.goalsAgainst += fixture.homeGoals;
      
            if (fixture.homeGoals > fixture.awayGoals) {
              homeTeam.points += 3;
              homeTeam.gamesWon += 1;
              awayTeam.gamesLost += 1;
            } else if (fixture.homeGoals < fixture.awayGoals) {
              awayTeam.points += 3;
              awayTeam.gamesWon += 1;
              homeTeam.gamesLost += 1;
            } else {
              homeTeam.points += 1;
              awayTeam.points += 1;
              homeTeam.gamesDrawn += 1;
              awayTeam.gamesDrawn += 1;
            }
          }
        });
      
        newStandings.forEach((team) => {
          team.goalDifference = team.goalsFor - team.goalsAgainst;
        });
      
        newStandings.sort((a, b) => {
          if (a.points === b.points) {
            if (a.goalDifference === b.goalDifference) {
              return b.goalsFor - a.goalsFor;
            }
            return b.goalDifference - a.goalDifference;
          }
          return b.points - a.points;
        });
      
        setStandings(newStandings);
      };
      
      
  
    const handleGoalChange = (fixtureIndex, team, value) => {
      const newFixtures = [...fixtures];
      const fixture = newFixtures[fixtureIndex];
  
      if (team === "home") {
        fixture.homeGoals = value === "" ? null : parseInt(value);
      } else {
        fixture.awayGoals = value === "" ? null : parseInt(value);
      }
  
      setFixtures(newFixtures);
      updateStandings();
    };
  
    const handleTeamNameChange = (index, newName) => {
      const newTeamNames = [...teamNames];
      newTeamNames[index] = newName;
      setTeamNames(newTeamNames);
    };
  
    const handleRowDragStart = (event, fixtureIndex) => {
      event.dataTransfer.setData("text/plain", fixtureIndex.toString());
    };
  
    const handleRowDragOver = (event) => {
      event.preventDefault();
    };
  
    const handleRowDrop = (event, dropIndex) => {
      event.preventDefault();
      const dragIndex = parseInt(event.dataTransfer.getData("text/plain"));
  
      if (dragIndex !== dropIndex) {
        const newFixtures = [...fixtures];
        const [draggedFixture] = newFixtures.splice(dragIndex, 1);
        newFixtures.splice(dropIndex, 0, draggedFixture);
        setFixtures(newFixtures);
      }
    };

    return (
      <div>
        <Table id="team-table" className="table table-striped">
          <thead>
            <tr>
              <th>EQUIPOS</th>
            </tr>
          </thead>
          <tbody>
            {teamNames.map((team, index) => (
              <tr key={index}>
                <td>
                  <input
                    type="text"
                    value={team}
                    onChange={(e) => handleTeamNameChange(index, e.target.value)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
  
        <Table id="standings-table" className="table table-striped">
  <thead>
    <tr>
      <th>Equipo</th>
      <th>PJ</th>
      <th>PG</th>
      <th>PE</th>
      <th>PP</th>
      <th>GF</th>
      <th>GC</th>
      <th>DG</th>
      <th>Pts</th>
    </tr>
  </thead>
  <tbody>
    {standings.map((team, index) => (
      <tr key={index}>
        <td>{team.name}</td>
        <td>{team.played}</td>
        <td>{team.gamesWon}</td>
        <td>{team.gamesDrawn}</td>
        <td>{team.gamesLost}</td>
        <td>{team.goalsFor}</td>
        <td>{team.goalsAgainst}</td>
        <td>{team.goalDifference}</td>
        <td style={{fontWeight: 'bold'}}>{team.points}</td>
      </tr>
    ))}
  </tbody>
</Table>

<Container>
        <Table id="fixture-table" className="table table-striped">
          <thead>
            <tr>
              <th colSpan='4'>PARTIDOS</th>
              {/* <th>Home Goals</th>
              <th>Away Goals</th>
              <th>Away Team</th> */}
            </tr>
          </thead>
          <tbody>
            {fixtures.map((fixture, index) => (
              <tr
                key={index}
                draggable
                onDragStart={(e) => handleRowDragStart(e, index)}
                onDragOver={handleRowDragOver}
                onDrop={(e) => handleRowDrop(e, index)}
              >
                <td>{fixture.homeTeam}</td>
                <td>
                  <input
                    type="number"
                    placeholder=""
                    className="short-input"
                    value={fixture.homeGoals === null ? "" : fixture.homeGoals}
                    onChange={(e) => handleGoalChange(index, "home", e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    placeholder=""
                    className="short-input"
                    value={fixture.awayGoals === null ? "" : fixture.awayGoals}
                    onChange={(e) => handleGoalChange(index, "away", e.target.value)}
                  />
                </td>
                <td>{fixture.awayTeam}</td>
              </tr>
            ))}
          </tbody>
        </Table>
        </Container>


      </div>
    );
  };
  
  export default SoccerGroupStage;