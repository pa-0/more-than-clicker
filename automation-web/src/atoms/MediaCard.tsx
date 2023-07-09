import React from "react";

import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";

interface MediaCardProps {
  id?: string;
  title?: any;
  description?: any;
  imgSrc?: any;
  loop?: boolean;
  bounce?: boolean;
  hoverPlay?: boolean;
  autoplay?: boolean;
  clickLink?: string;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  style?: any;
}

export const MediaCard = (props: MediaCardProps) => {
  return (
    <div style={{ cursor: "pointer" }} onClick={props.onClick}>
      <Card
        style={{
          ...props.style,
          height: "8rem",
          width: "8rem",
          padding: "1rem",
        }}
      >
        {props.imgSrc && (
          <div
            style={{
              height: "4rem",
              width: "100%",
              backgroundImage: `url("${props.imgSrc}")`,
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            }}
          />
        )}
        <CardContent style={{ paddingTop: "1px" }}>
          <Typography variant="caption" color="textSecondary" component="p">
            {props.title}
          </Typography>
          <Typography variant="caption" color="textSecondary" component="p">
            {props.description}
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
};
