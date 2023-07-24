import React, { useState, useEffect, useCallback } from "react";
import { createStage } from "../gameHelpers";

// Styled Components
import { StyledTetris, StyledTetrisWrapper } from "./styles/StyledTetris";

// Custom Hooks
import { usePlayer } from "../hooks/usePlayer";
import { useStage } from "../hooks/useStage";

// Components
import Stage from "./Stage";
import Display from "./Display";
import StartButton from "./StartButton";

const Tetris = () => {
  const [dropTime, setDropTime] = useState(null);
  const [player, updatePlayerPos, resetPlayer] = usePlayer();
  const [stage, setStage] = useStage(player);
  const [gameOver] = useState(false);

  console.log("re-render");

  const dropPlayer = useCallback(() => {
    updatePlayerPos({ x: 0, y: 1, collided: false });
  }, [updatePlayerPos]);

  useEffect(() => {
    // This effect will run whenever dropTime or dropPlayer changes
    if (dropTime) {
      // Start the drop interval
      const timer = setInterval(() => {
        dropPlayer();
      }, dropTime);

      // Clean up the interval when the component unmounts or when dropTime changes again
      return () => {
        clearInterval(timer);
      };
    }
  }, [dropTime, dropPlayer]);

  // const movePlayer = dir => {
  //   updatePlayerPos({ x: dir, y: 0 });
  // };

  const startGame = () => {
    // Reset everything
    setStage(createStage());
    resetPlayer();
    setDropTime(1000); // Set the drop interval to 1 second
  };
  const move = useCallback(
    ({ keyCode }) => {
      if (!gameOver) {
        if (keyCode === 37) {
          updatePlayerPos({ x: -1, y: 0 }); // Move left
        } else if (keyCode === 39) {
          updatePlayerPos({ x: 1, y: 0 }); // Move right
        } else if (keyCode === 40) {
          dropPlayer(); // Drop down
        }
      }
    },
    [gameOver, updatePlayerPos, dropPlayer]
  );

  return (
    <StyledTetrisWrapper role="button" tabIndex="0" onKeyDown={e => move(e)}>
      <StyledTetris>
        <Stage stage={stage} />
        <aside>
          <div>
            <Display text="Score" />
            <Display text="Rows" />
            <Display text="Level" />
          </div>
          <StartButton callback={startGame} />
        </aside>
      </StyledTetris>
    </StyledTetrisWrapper>
  );
};

export default Tetris;
