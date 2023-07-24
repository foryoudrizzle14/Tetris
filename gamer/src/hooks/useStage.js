import { useState, useEffect, useRef } from "react";
import { createStage } from "../gameHelpers";

export const useStage = (player, resetPlayer) => {
  const [stage, setStage] = useState(createStage());
  const stageRef = useRef(stage);

  useEffect(() => {
    stageRef.current = stage;
  }, [stage]);

  useEffect(() => {
    const updateStage = prevStage => {
      // First flush the stage
      const newStage = prevStage.map(row => row.map(cell => (cell[1] === "clear" ? [0, "clear"] : cell)));

      // Then draw the tetromino if the player object is valid
      if (player && player.tetromino && player.pos) {
        player.tetromino.forEach((row, y) => {
          row.forEach((value, x) => {
            if (value !== 0) {
              // Check for valid array indices before setting values
              if (
                y + player.pos.y >= 0 &&
                y + player.pos.y < stageRef.current.length &&
                x + player.pos.x >= 0 &&
                x + player.pos.x < stageRef.current[y + player.pos.y].length
              ) {
                newStage[y + player.pos.y][x + player.pos.x] = [value, `${player.collided ? "merged" : "clear"}`];
              }
            }
          });
        });

        // Check if the tetromino has collided with the bottom or other blocks
        if (player.collided) {
          resetPlayer(); // Reset the player position to start a new tetromino
        }
      }

      return newStage;
    };

    setStage(prev => updateStage(prev));
  }, [player, resetPlayer]);

  return [stage, setStage];
};
