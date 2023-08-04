<Box
className="chat-box"
ref={listBoxEl}
id="chatbox"
>
{roomCode && (
  <InfiniteScroll dataLength={20} hasMore={true}>
    <ul
      id="messages"
      className="Messages-List"
      key={`chatlist-${status}`}
      style={{
        paddingRight: 10,
      }}
    >
      <LoaderSmall loading={loading1} />

      {Object.entries(
        chatHistory.reduce((chat, row) => {
          const { queue_info } = row;
          if (!chat[queue_info]) {
            chat[queue_info] = [];
          }
          chat[queue_info].push(row);

          return chat;
        }, {})
      ).map(([queue, chats]) => {
        const queue_info = JSON.parse(
          queue ||
            `{"queue_status":"ONGOING", "queue_id" : ${queueId}}`
        );
        return (
          <React.Fragment key={queue}>
            {chats.map((chat, index) => {
              const messageFromMe =
                chat.message_from === "CSR";
              const sender = messageFromMe
                ? chat.csr
                : chat.customer;
              return (
                <React.Fragment
                  key={`lisMessage${index}${queue}`}
                >
                  <li
                    className={
                      messageFromMe
                        ? "Messages-message currentMember"
                        : "Messages-message"
                    }
                  >
                    <div className="Message-content">
                      <div className="avatar">
                        {!messageFromMe && (
                          <AccountCircleIcon
                            sx={{
                              height: "25px",
                              width: "25px",
                            }}
                            style={{
                              color: "#1178f5",
                            }}
                          />
                        )}
                        {messageFromMe && (
                          <SupportAgentSharpIcon
                            sx={{
                              height: "25px",
                              width: "25px",
                            }}
                            style={{
                              color: "#fc821e",
                            }}
                          />
                        )}
                      </div>

                      <Slide
                        direction="left"
                        in
                        mountOnEnter
                      >
                        <div className="text">
                          {chat.message}
                          {/*
                <img
                  src={`data:image/jpeg;base64,${chat.message}`}
                />
                */}

                          <div className="timestamp">
                            {m(
                              chat.created_at
                            ).format(
                              "YYYY-MM-DD HH:mm:ss"
                            )}
                          </div>
                        </div>
                      </Slide>
                    </div>
                  </li>
                </React.Fragment>
              );
            })}
            <div
              style={{
                paddingBottom: 30,
                marginTop: 30,
                fontWeight: "bold",
                display:
                  queue_info.queue_status ===
                  "ONGOING"
                    ? "none"
                    : "block",
              }}
            >
              <Divider light={false}>
                {queue_info.queue_status}
              </Divider>
            </div>
          </React.Fragment>
        );
      })}
    </ul>
  </InfiniteScroll>
)}
{roomCode === undefined && (
  <Box
    sx={{
      position: "relative",
      top: "48%",
      left: "40%",
      width: "400px",
    }}
  >
    Select a Convo
  </Box>
)}
</Box>







{roomId && (
  <Grid container>
    <Grid item xs={11}>
      <div className="convo-header">
        <Avatar
          sx={{
            display: "flex",
            fontSize: "smaller",
          }}
        >
          {`${chatRoom?.chat_name?.charAt(
            0
          )}${chatRoom?.chat_name?.charAt(
            chatRoom?.chat_name?.lastIndexOf(" ") + 1
          )}`}
        </Avatar>
        <span className="text">
          {chatRoom.chat_name}
        </span>
      </div>
    </Grid>
    <Grid
      item
      xs={1}
      className="convo-header"
      sx={{
        textAlign: "end",
      }}
    >
      <span className="icon">
        <Tooltip title="Pop-out Chat">
          <IconButton
            onClick={() => {
              showChatWindow({
                chatHistory,
                chatRoom,
              });
            }}
          >
            <LaunchIcon
              style={{
                fontSize: "large",
              }}
            />
          </IconButton>
        </Tooltip>
      </span>
    </Grid>
  </Grid>
)}



<Grid container>
<Grid item xs={12}>
  {roomCode && !chatEnded && (
    <Box
      component={"form"}
      onSubmit={onSubmit}
      className="chat-field"
      encType="multipart/form-data"
    >
      <Grid container className="chat-form">
        <Grid item xs={12} paddingRight={3}>
          <TextField
            type="text"
            onChange={(e) => {
              onChange(e);
            }}
            value={state.message}
            sx={{
              marginLeft: 2,
              paddingTop: 0.5,
              paddingLeft: 1.5,
              paddingRight: 1.5,
              borderRadius: 5,
              border: 1,
              fontSize: "small",
              borderColor: "#9e9e9e",
            }}
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Stack direction={"row"} gap={0}>
                    <Tooltip title="Emoji">
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowEmojis(!showEmojis);
                        }}
                        sx={{
                          padding: 0.3,
                        }}
                      >
                        <EmojiEmotionsIcon
                          fontSize="small"
                          style={{
                            color: "#0747f5",
                          }}
                        />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Send">
                      <IconButton
                        type="submit"
                        sx={{
                          padding: 0.3,
                        }}
                      >
                        <SendIcon
                          style={{
                            color: "#0747f5",
                          }}
                          fontSize="small"
                        />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Photo">
                      <IconButton
                        component="label"
                        sx={{
                          padding: 0.3,
                        }}
                      >
                        <input
                          type="file"
                          accept="image/*"
                          style={{
                            display: "none",
                          }}
                          onChange={handleFileChange}
                          name="file"
                          multiple
                        />
                        <PhotoIcon
                          style={{
                            color: "#0747f5",
                          }}
                          fontSize="small"
                        />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="End Chat">
                      <IconButton
                        onClick={() => {
                          setConfirmDialogOpen(true);
                        }}
                        sx={{
                          padding: 0.3,
                        }}
                      >
                        <DoDisturbAltRoundedIcon
                          fontSize="small"
                          style={{
                            color: "#fc0303",
                          }}
                        />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </InputAdornment>
              ),
              disableUnderline: true,
              style: {
                textAlign: "center",
              },
              startAdornment: (
                <Oval
                  height={20}
                  width={20}
                  color="#2b2b2b"
                  wrapperStyle={{}}
                  wrapperClass=""
                  visible={!chatActive}
                  ariaLabel="oval-loading"
                  secondaryColor="#2b2b2b"
                  strokeWidth={6}
                  strokeWidthSecondary={6}
                />
              ),
            }}
            autoFocus={true}
            size="small"
            variant="standard"
            disabled={!chatActive}
          />
        </Grid>

        <Grid item xs={6}>
          {showEmojis && (
            <div
              style={{
                position: "absolute",
                top: "320px",
                right: "180px",
                maxWidth: "320px",
                borderRadius: "20px",
                backgroundColor: "red",
                padding: 0,
              }}
            >
              <Picker
                data={data}
                onEmojiSelect={addEmoji}
                theme="dark"
                onClickOutside={() => {
                  setShowEmojis(false);
                }}
              />
            </div>
          )}
        </Grid>
      </Grid>
    </Box>
  )}

 
</Grid>
</Grid>