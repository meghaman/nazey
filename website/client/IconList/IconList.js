import React from 'react';

const Icon = (props) =>
{
	return(
                <span className="desktop-list-icon">
                    <a href={props.link} target="_blank">
                        <img src={props.image} height="65" width="65" />
                        <br />
			{props.name} 
                    </a>
                </span>
	)
};

export const IconList = (props) =>
{
	return(
		<span className="desktop-list">
			<Icon name="Resume" link="resume/MuraliKulachandran.pdf" image="assets/Pdflogogt.png"/>
			<Icon name="LinkedIn" link="https://www.linkedin.com/in/murali-kulachandran-998b8216/" image="assets/linkedin.png"/>
			<Icon name="Stand-up Set" link="https://www.youtube.com/watch?v=HMogavLqgAM" image="assets/youtube.png"/>
		</span>
	);
}
