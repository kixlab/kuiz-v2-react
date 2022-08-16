import { HighlightOff, Tag } from "@mui/icons-material";
import { FormControl, Stack, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useRef, useState } from "react";
import './InputTags.scss'

const Tags = ({ data, handleDelete, type }) => {
  return (
    <Box
      sx={{
        background: type?"#FFF6EB":"#F4EBFF",
        height: "40%",
        display: "flex",
        padding: "0.4rem 0.5rem 0.4rem 0.7rem",
        margin: "0 0.5rem 0.4rem 0",
        justifyContent: "center",
        alignContent: "center",
        color: "#FFFFF",
        boxShadow: 3,
        borderRadius:4
      }}
    >
      <Stack direction='row' gap={0.5}>
        <Typography><div className="tag-data">{data}</div></Typography>
        <HighlightOff
          color="action"
          sx={{ 
            cursor: "pointer" ,
            // height: "60%"
            fontSize:20
          }}
          onClick={() => {
            handleDelete(data);
          }}
        />
      </Stack>
    </Box>
  );
};

function InputTags({handleDelete, handleOnSubmit, tags, type}) {
  const tagRef = useRef();

  const handleOnSubmit2 = (e) => {
    e.preventDefault();
    if(tags.length<3){
      handleOnSubmit(tagRef)
      tagRef.current.value = "";
    }
  };
  return (
    <div className="tag-box">
      <Box sx={{ flexGrow: 1 }}>
        <form onSubmit={handleOnSubmit2}>
          <TextField
            inputRef={tagRef}
            fullWidth
            variant='filled'
            size='small'
            sx={{ margin: "0.4rem 0.4rem 0.5rem 0.5rem" }}
            margin='none'
            placeholder={tags.length < 5 ? "Add tags" : ""}
            style={{width:"90%"}}
          />
          <Box sx={{ margin: "0 0.2rem 0.4rem 0.5rem", display:"flex"}}>
              {tags.map((data, index) => {
                return (
                  <Tags data={data} handleDelete={handleDelete} key={index} type={type} />
                );
              })}
          </Box>
        </form>
      </Box>
    </div>
    
  );
}

export default InputTags
