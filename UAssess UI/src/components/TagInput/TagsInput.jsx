import React from "react";
import { Row, ControlLabel } from "react-bootstrap";
const Tag = props => <span className="tag" {...props} />;
const Delete = props => <input value="  X" readOnly className="delete" {...props} />;

export default class TagsInput extends React.Component {
  state = {
    newTag: ""
  };

  handleRemoveTag = e => {
    e.preventDefault();
    let tag = e.target.parentNode.textContent.trim();
    this.props.removeTag(tag)
    this.setState({ newTag: "" });
  };

  render() {
    return (
      <Row>
        <ControlLabel>{this.props.label}</ControlLabel>
        <div className="col-md-12 tags-input question-dropdown">
          {this.props.value.map((tag, index) => (
            <Tag key={index}>
              {tag}
              <Delete onClick={this.handleRemoveTag} />
            </Tag>
          ))}
        </div>
      </Row>
    );
  }
}
