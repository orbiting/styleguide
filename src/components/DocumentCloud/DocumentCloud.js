import React, { Component } from "react";
import PropTypes from "prop-types";
import { css, merge } from "glamor";
import { mUp } from "../../theme/mediaQueries";
import { FigureCaption } from "../Figure";
import Image from "./Image";
import ShowIcon from "react-icons/lib/md/search";
import Button from "../Button";

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
  showNote: css({
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%,-50%)",
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
        <a href={url} target="_blank" rel="noopener, noreferrer" {...styles.showNote}>
          <Button black>
            {t("styleguide/documentcloud/showDocument")}
          </Button>
        </a>
        <Image src={thumbnail} maxWidth="400px" alt={title} />
        <FigureCaption {...styles.figCaption} maxWidth="400px" >
          <a href={url} target="_blank" rel="noopener, noreferrer">{title}</a>
        </FigureCaption>
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
