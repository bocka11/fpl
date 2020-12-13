import React,{useEffect,useState} from 'react'
import CanvasJSReact from './canvasjs.react';
import axios from 'axios';

const fpl = require('fpl-api');

const CanvasJs = CanvasJSReact.CanvasJs;
const CanvasJSChart = CanvasJSReact.CanvasJSChart;

const url = 'https://fantasy.premierleague.com/api/bootstrap-static/';
const backend_url = process.env.B_URL || 'http://localhost:3333/average';
const backend_url_players = process.env.PLAYERS || 'http://localhost:3333/players';

const teams = {
    1:"Arsenal",
    2:"Aston Villa",
    3:"Brighton",
    4:"Burnley",
    5:"Chelsea",
    6:"Crystal Palace",
    7:"Everton",
    8:"Fulham",
    9:"Leeds United",
    10:"Leister City",
    11:"Liverpool",
    12:"Manchester City",
    13:"Manchester United",
    14:"Newcastle United",
    15:"Sheffield United",
    16:"Southampton",
    17:"Tottenham Hotspurs",
    18:"West Bromwich Albion",
    19:"West Ham United",
    20:"Wolverhampton Wanderers"
}

function getKey(obj,value){
    for(let key in obj){
        if(obj[key]==value)
            return key;
    }
    return "";
}

function getKeyPlayer(obj,value){
    for(let key in obj){
        if(obj[key].name == value)
        return obj[key].id;
    }
    return 1;
}

function teamsArray(teams){
    var pom = [];
    for(let key in teams){
        pom.push(teams[key]);
    }
    return pom;

}
var arrayTeams =teamsArray(teams);
var players = [];



const HEADERS = {
    'User-Agent':
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.135 Safari/537.36',
  };



const App = ()=>{
    
    const [data,setData] = useState([]);
    const [selectedTeam,setSelectedTeam] = useState('');
    const [selectedPlayers,setSelectedPlayers] = useState([]);
    const [selectedID,setSelectedID] = useState(1);
    useEffect(()=>{
        async function fetchdata(url){
            const response = await axios.get(url);
            setData(response.data);
        }
        fetchdata(backend_url_players);
        
        
    },[]);
    useEffect(()=>{
        players = data.filter(value=>{
           return value.team == getKey(teams,selectedTeam);
        })
        setSelectedPlayers(players);
        console.log("Selectirani igraci",players)
    },[selectedTeam])
   /* const datap = data.sort((a,b)=>{
        let x = a['gameweek'];
        let y = b['gameweek'];
        if(x<y){
            return -1;
        }else 
        if(x>y)return 1;
        else return 0;
    }); */
    console.log("Podatoci",data);
    
    var player_points = [];
    var p = {name:''};

    if(data.length > 0){
    
    p = data[getKeyPlayer(selectedPlayers.filter(v=>v.name=selectedID),selectedID)];
    player_points = data[getKeyPlayer(selectedPlayers.filter(v=>v.name=selectedID),selectedID)].points;
    console.log(player_points.points);
    }
    
    const options = {
        animationEnabled: true,
        exportEnabled: true,
        theme: "light2", // "light1", "dark1", "dark2"
        title:{
            text: `Broj poeni po kolo za ${p.name}`
        },
        axisY: {
            title: "Bodovi"
            
        },
        axisX: {
            title: "Gameweek",
            interval: 1
        },
        data: [{
            type: "line",
            toolTipContent: "Gameweek {x}: {y}pts",
            dataPoints: player_points.map(value=>{
                if(typeof value != 'undefined'){
                var pom = {};
                pom['x'] = value.gameweek;
                pom['y'] = value.totalpoints;
                return pom;}else{
                    return {};
                }
            }) /* test.map(value=>{
                var pom ={};
                pom['x']=Number(value.gameweek);
                pom['y']=value.average_points;
                return pom;
            }) */
        }]
    }
    return <div>
            <select onChange={(event)=>{setSelectedTeam(event.target.value)}}>
                
                {
                    
                    arrayTeams.map(v=>{
                    
                     return <option value={v}>{v}</option>
                    })
                }
            </select>
            <select onChange={(event)=>{
                setSelectedID(event.target.value);
            }}>
                {
                    //console.log("Vo select",)
                    selectedPlayers.map(v=>{
                    return <option value={v.name}>{v.name}</option>
                    })
                }
            </select>
            <CanvasJSChart options={options}/></div>;
}

export default App;