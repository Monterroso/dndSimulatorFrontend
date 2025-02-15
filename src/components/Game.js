import React from "react"

const Game = ({handler, actionSubmit}) => {
  // board dimensions
  const dims = handler.getObject(["board", "dims"]).map(index => handler.getObject([], index))

  const actors = handler.getObject(["actors"])
  
  // Entities name with their positions
  const entities = {}

  actors.forEach(actorIndex => {
    const pos = handler.getObject(["actorPos", actorIndex]).map(index => handler.getObject([], index))
    
    entities[handler.getObject(["id"], actorIndex)] = pos
  })

  // Display turn counter, display current turn user
  const turn = handler.getObject(["currentTurn"])

  const currentUser = handler.getObject(["id"], actors[turn])

  const currentActorStats = handler.getObject(["baseStats"], actors[turn])
  const currentActorStatsIndex = handler.getIndex(currentActorStats)
  const currentActorStatsPreview = handler.preview(currentActorStatsIndex)

  // Display action stack
  const actionStack = handler.getObject(["actionStack"])

  const actions = actionStack.map(index => {
    const actorAction = handler.getObject([], index)
    const actor = handler.getObject(["id"], actorAction[0])
    const actionId = actorAction[1]
    const startingPos = handler.getObject(["actorPos", actorAction[0]]).map(i => handler.getObject( [], i))
    const endingPos = handler.getObject(["endingPos"], actionId).map(i => handler.getObject( [], i))
    const actionType = handler.getObject(["actionType"], actionId)

    return { actor, startingPos, endingPos, actionType }
  })

  return (
    <div>
      <p>Board Dimensions {JSON.stringify(dims)}</p>

      <p>Actor Positions: {
        Object.keys(entities).map(key => {
          return (
            <div>
              {`${key}: ${entities[key]}`}
              <br/>
            </div>
          )
          
        })}
      </p>

      <p>Turn: {turn}</p>

      <p>Current Actor's Turn: {currentUser}</p>

      <p>Action Stack: {actions.map(action => 
        {
          return (
            <div>
              {`Actor: ${action.actor} Start: ${action.startingPos} End: ${action.endingPos}`}
              <br/>
            </div>
          )
        })}
      </p>

      <p>Actor Stats: {
          JSON.stringify(currentActorStatsPreview)
        }
      </p>

      <form action="" onSubmit={(event) => actionSubmit(event, currentUser, event.target[0].value)}>
        <label>Action Input</label>
        <input
          id="actionInput"
          type="text"
        />
      </form>
    </div>
  )
}

export default Game