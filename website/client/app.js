import React from 'react';
import ReactDOM from 'react-dom';

function Icon(props)
{
	return(
                <span className="desktop-list-icon">
                    <a href={props.link} target="_blank">
                        <img src="assets/Pdflogogt.png" height="65" width="65" />
                        <br />
			{props.name} 
                    </a>
                </span>
	)
};

ReactDOM.render(
	<Icon name="Resume" link="resume/MuraliKulachandran.pdf"/>
	,
	document.getElementById('app')
);
