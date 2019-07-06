import React, { Component } from "react";

export class Card extends Component {
  render() {
    return (
      <div
        className={
          "card" +
          (this.props.plain ? " card-plain" : "") +
          (this.props.question ? " question" : "") +
          (this.props.login ? " login-container__form-container" : "") +
          (this.props.skills ? " skills" : "") +
          (this.props.noPadding ? " no-padding" : "")
        }
      >
        {this.props.header ? (
          <div
            className={"header" + (this.props.hCenter ? " text-center" : "")}
          >
            <h4 className="title">{this.props.title}</h4>
          </div>
        ) : (
          ""
        )}
        <div
          className={
            "content" +
            (this.props.ctAllIcons ? " all-icons" : "") +
            (this.props.ctTableFullWidth ? " table-full-width" : "") +
            (this.props.ctTableResponsive ? " table-responsive" : "") +
            (this.props.ctTableUpgrade ? " table-upgrade" : "") +
            (this.props.noPadding ? " no-padding" : "")
          }
        >
          {this.props.content}
        </div>
      </div>
    );
  }
}

export default Card;
