import React from 'react';
import PropTypes from 'prop-types';
import { Loader } from 'components';
import Button from '@material-ui/core/Button';
import './fmButton.css';

const Load = props=>{
  return(
    <div className="fmLoader"><Loader fill={ props.loaderFill } /></div>
  )
} 
const FmButton = (props)=>{
  var { id, inactive, custom, disabled, styles, variant, text, onClick, isActive, loaderFill, buttonWrapperWidth } = props;
  const clickButton = (e)=>{
    e.persist();
    e.preventDefault();
  };
  disabled = disabled?disabled:!isActive;
  return(
    <div id="btn" style={{ width: buttonWrapperWidth }} className="button-wrapper">
    { !custom?
      <Button id = { id } disabled={ disabled || !isActive } onClick={ onClick } variant={ variant } style={styles.button}>
        { isActive && !inactive?
          <span id={ id } onClick = { clickButton }>{ text }</span>:
          inactive?
          <span id={ id } onClick = { clickButton }>{ text }</span>:
          <Load loaderFill={ loaderFill } />
        }
      </Button>
      :<div id = { id } disabled={ disabled || !isActive } onClick={ onClick } style={styles.button}>
        { isActive && !inactive?
          <span id={ id } onClick = { clickButton }>{ text }</span>:
          inactive?
          <span id={ id } onClick = { clickButton }>{ text }</span>:
          <Load loaderFill={ loaderFill } />
        }
      </div> }
    </div>
  )
}

FmButton.defaultProps = {
  color: "primary",
  isActive: true,
  loaderFill: "#fff"
}

FmButton.propTypes = {
    text: PropTypes.string.isRequired,
    variant: PropTypes.string,
    styles: PropTypes.object.isRequired,
    onClick: PropTypes.func,
    isActive: PropTypes.bool.isRequired,
    loaderFill: PropTypes.string
}

export default FmButton;
