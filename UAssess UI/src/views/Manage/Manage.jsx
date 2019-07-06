import React, { Component } from "react";
import { Grid, Row } from "react-bootstrap";
import Skills from "./Skills";
import Competency from "./Competency";
import SubCompetency from "./Sub-Competency";
import Level from "./Level";
import * as SkillsApi from "../../api/SkillApi";
import * as CompetencyApi from "../../api/CompetencyApi";
import * as SubCompetencyApi from "../../api/SubCompetencyApi";
import * as LevelApi from "../../api/LevelApi";

export default class Manage extends Component {
  state = {
    main_skill_list: "",
    main_competency_list: "",
    main_subcompetency_list: ""
  };

  updateSkillList = e => {
    this.setState(() => {
      return {
        main_skill_list: e
      };
    });
  };

  updateCompetencyList = e => {
    this.setState(() => {
      return {
        main_competency_list: e
      };
    });
  };

  updateSubCompetencyList = e => {
    this.setState(() => {
      return {
        main_subcompetency_list: e
      };
    });
  };

  updateLevelList = e => {
    this.setState(() => {
      return {
        main_level_list: e
      };
    });
  };

  componentDidMount() {
    SkillsApi.GetSkillsApi().then(res => {
      this.setState(() => {
        return {
          main_skill_list: res.data
        };
      });
    });

    CompetencyApi.GetCompetenciesApi().then(res => {
      this.setState(() => {
        return {
          main_competency_list: res.data
        };
      });
    });

    SubCompetencyApi.GetSubCompetenciesApi().then(res => {
      this.setState(() => {
        return {
          main_subcompetency_list: res.data
        };
      });
    });

    LevelApi.GetLevelApi().then(res => {
      this.setState(() => {
        return {
          main_level_list: res.data
        };
      });
    });
  }

  render() {
    return (
      <div className="content">
        <Grid fluid>
          <Row>
            <div className="nav-switch-tab_container">
              <input
                id="nav-switch-tab1"
                type="radio"
                name="tabs"
                defaultChecked
                className="nav-switch"
              />
              <label htmlFor="nav-switch-tab1" className="nav-switch">
                <span className="nav-switch">
                  <i className="fa fa-cubes" /> Skills
                </span>
              </label>
              <input
                id="nav-switch-tab2"
                type="radio"
                name="tabs"
                className="nav-switch"
              />
              <label htmlFor="nav-switch-tab2" className="nav-switch">
                <span className="nav-switch">
                  <i className="fa fa-signal" /> Competency
                </span>
              </label>
              <input
                id="nav-switch-tab3"
                type="radio"
                name="tabs"
                className="nav-switch"
              />
              <label htmlFor="nav-switch-tab3" className="nav-switch">
                <span className="nav-switch">
                  <i className="fa fa-check" /> SubCompetency
                </span>
              </label>
              <input
                id="nav-switch-tab4"
                type="radio"
                name="tabs"
                className="nav-switch"
              />
              <label htmlFor="nav-switch-tab4" className="nav-switch">
                <span className="nav-switch">
                  <i className="fa fa-navicon" /> Level
                </span>
              </label>
              <section
                id="nav-switch-content1"
                className="nav-switch-tab-content nav-switch"
              >
                <Skills
                  main_skill_list={this.state.main_skill_list}
                  main_competency_list={this.state.main_competency_list}
                  updateSkillList={this.updateSkillList}
                />
              </section>
              <section
                id="nav-switch-content2"
                className="nav-switch-tab-content nav-switch"
              >
                <Competency
                  main_competency_list={this.state.main_competency_list}
                  main_subcompetency_list={this.state.main_subcompetency_list}
                  updateCompetencyList={this.updateCompetencyList}
                />
              </section>
              <section
                id="nav-switch-content3"
                className="nav-switch-tab-content nav-switch"
              >
                <SubCompetency
                  main_subcompetency_list={this.state.main_subcompetency_list}
                  updateSubCompetencyList={this.updateSubCompetencyList}
                />
              </section>
              <section
                id="nav-switch-content4"
                className="nav-switch-tab-content nav-switch"
              >
                <Level
                  main_level_list={this.state.main_level_list}
                  updateLevelList={this.updateLevelList}
                />
              </section>
            </div>
          </Row>
        </Grid>
      </div>
    );
  }
}
