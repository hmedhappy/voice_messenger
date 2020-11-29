import React, {  useState  } from 'react'

import './App.css';
import { Avatar ,IconButton } from '@material-ui/core'
import ColorLensIcon from '@material-ui/icons/ColorLens';
import OpacityTwoToneIcon from '@material-ui/icons/OpacityTwoTone';
import { MicNone } from "@material-ui/icons";

export default function App() {

  const [colorSwitch, setColorSwitch] = useState(false);
  const primaryStyle= {
    backgroundColor :'#e7f4ff'
  }
  const secondaryStyle= {
    backgroundColor:'#262f23'
  }

    return (
    <div className="App">
      <div className="chat" style={colorSwitch?secondaryStyle:primaryStyle}>
        <div className="chat_header">
          <Avatar style={{width: '89px',height: '75px'}} src='azizaLogo.png'/>
                    <div className="chat_headerInfo">
                        <h3 style={colorSwitch?{color:'white'}:{color:'black'}}>3ZIZA</h3>
                    </div>
                    <div className="chat_headerRight">
                      <OpacityTwoToneIcon style={
                        colorSwitch
                        ?{ color:'white'}
                        :{color : "black"}
                      }
                      />
                      
                    {colorSwitch
                    ?<h3 style={{color:'white'}}>Primaire</h3>
                    :<h3>Secondaire</h3>
                    }
                    <IconButton onClick={()=>setColorSwitch(!colorSwitch)}>
                        <ColorLensIcon  style={
                        colorSwitch
                        ?{ color:'white'}
                        :{color : "black"}
                        }/>
                    </IconButton>
                    </div>
            </div>
    <div id="hey"  className="chat_body" data-role="recordings" style={
      colorSwitch
      ?{border: '2px solid white'}
      :{border: '2px solid black'}
    }> 
    </div>
    <div className="chat_footer" data-role="controls">
    <button>
    <MicNone style={{marginLeft: '-42px'}}/>
    </button>
    </div>
</div>
    </div>
    )
}
