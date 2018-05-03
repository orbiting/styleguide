import React, { Component } from "react";
import PropTypes from "prop-types";
import { css, merge } from "glamor";
import { mUp } from "../../theme/mediaQueries";
import { FigureCaption } from "../Figure";
import Image from "./Image";
import ShowIcon from "react-icons/lib/md/search";

const styles = {
  container: css({
    textDecoration: "none",
    position: "relative",
    padding: 0,
    margin: 0,
    marginTop: 36,
    marginBottom: 36,
    [mUp]: {
      marginTop: 45,
      marginBottom: 45
    }
  }),
  thumbnail: css({
    cursor: "pointer",
    display: "inline-block",
    lineHeight: 0,
    position: "relative",
    width: "100%",
    "::before": {
      position: "absolute",
      background: "rgba(0, 0, 0, .6)",
      content: " ",
      height: "100%",
      width: "100%",
      zIndex: 9
    }
  }),
  showIcon: css({
    color: "#fff",
    lineHeight: 0,
    position: "absolute",
    left: "calc(50% - 13px)",
    top: "calc(50% - 30px)",
    zIndex: 9
  }),
  showNote: css({
    position: "absolute",
    top: "calc(50% + 18px)",
    left: "50%",
    transform: "translate(-50%,0)",
    color: "#000000",
    background: "rgba(255,255,255,0.4)",
    width: "100%",
    maxWidth: 400,
    padding: 20,
    lineHeight: 1.2,
    textAlign: "center",
    zIndex: 9
  })
};

class DocumentCloud extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { t, attributes, url, title, thumbnail } = this.props;

    return (
      <figure {...attributes} {...merge(styles.container)}>
        <span {...styles.showIcon}>
          <ShowIcon size={40} />
        </span>
        <a href={url} target="_blank" rel="noopener, noreferrer" {...styles.showNote}>
          {t("styleguide/documentcloud/showDocument")}
        </a>
        <Image src={thumbnail} alt="" />
        <FigureCaption>{title}</FigureCaption>
      </figure>
    );
  }
}

DocumentCloud.propTypes = {
  t: PropTypes.func.isRequired,
  url: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  thumbnail: PropTypes.string.isRequired
};

DocumentCloud.defaultProps = {
  t: () => "",
  url: undefined,
  title: undefined,
  thumbnail: false
};

export default DocumentCloud;
