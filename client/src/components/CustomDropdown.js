import React, {useState} from 'react';
import {Dropdown, DropdownButton, FormControl, Button, ButtonGroup} from 'react-bootstrap';

const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
  <a
    href=""
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
  >
    {children}
    &#x25bc;
  </a>
));

// forwardRef again here!
// Dropdown needs access to the DOM of the Menu to measure it
const CustomMenu = React.forwardRef(
  ({ children, style, className, 'aria-labelledby': labeledBy }, ref) => {
    const [value, setValue] = useState('');
    return (
      <div
        ref={ref}
        style={style}
        className={className}
        aria-labelledby={labeledBy}
        style={{maxHeight: '500px'}}
      >
        <FormControl
          autoFocus
          className="mx-3 my-2 w-auto"
          placeholder="Type to filter..."
          onChange={(e) => {setValue(e.target.value)}}
          value={value}
        />
        <ul className="list-unstyled">
          {React.Children.toArray(children).filter(
            (child) =>
              !value || child.props.children.toLowerCase().startsWith(value),
          )}
        </ul>
      </div>
    );
  },
);
export default class CustomDropdown extends React.Component {
  constructor(props) {
    super(props);
    // this.state = {
    //   dropdownjerns: []
    // };
  }

  componentDidMount() {
    
  }

  render(){
    return (
      <Dropdown as={ButtonGroup}>
      <Button variant="success">View All Songs</Button>
    
      <Dropdown.Toggle split variant="success" id="dropdown-split-basic" />
    
      <Dropdown.Menu as={CustomMenu}>
       {this.props.dropdownjerns}
      </Dropdown.Menu>
    </Dropdown>
  )};
}
