import {
  Box,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { httpPrivate } from "../../services/Api";
import useCategory from "../../hooks/useCategory";
import { Link } from "react-router-dom";
import { checkGridRowIdIsValid } from "@mui/x-data-grid";

const CategoryTemplate = () => {
  const [templateRows, setTemplateRows] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedTemplate, selectTemplate] = useState({
    categories: `{"category_id":"*"}`,
    template_type: 1,
  });
  const { categories } = useCategory();
  const [checkedCategory, setCheckedCategory] = useState({});
  const [ckMainCategory, setCkMainCategory] = useState(false);
  const [checkSub, setCheckSub] = useState([]);

  let checks = [];
  useEffect(() => {
    let ignore = false;

    if (!ignore) {
      async function getTemplates() {
        await httpPrivate.get("/category-template").then((response) => {
          setTemplateRows(response.data);
        });
      }
      getTemplates();
    }

    return () => {
      ignore = true;
    };
  }, []);

  const handleSelectedIndex = (value, index) => {
    selectTemplate(value);
    setSelectedIndex(index);

    //  console.log(value);
  };

  const handleCategoryCheck = (event, category, subCategory) => {
    //console.log(event.target.checked);
    if (!checkSub[category]) {
      checkSub[category] = [];
    }
    if (event.target.checked) {
      checkSub[category].push(subCategory);
      setCheckSub(checkSub);
    } else {
      setCheckSub(
        checkSub[category].filter(
          (val) => val.sub_category_id !== subCategory.sub_category_id
        )
      );
    }

    //   console.log(checkSub[category]);
  };

  const handleMainCategoryCheckChanged = (event) => {};

  const validateChecked = (value) => {
    const categories = JSON.parse(selectedTemplate.categories);

    //  console.log(value)
    if (categories.category_id === "*") {
      return true;
    } else {
      const category_id = JSON.parse(categories.category_id);
      return category_id.indexOf(value.category_id) !== -1;
    }

    return false;
  };

  return (
    <Box paddingTop={3}>
      <Grid container>
        <Grid item xs={2}>
          <List
            disablePadding
            sx={{
              height: "90vh",
              borderRight: 1,
              borderRightColor: "#c7c6c5",
              paddingRight: 0.3,
            }}
          >
            <ListItem
              key="header"
              sx={{ backgroundColor: "#888888", marginBottom: 1 }}
            >
              <div style={{ fontWeight: "bold" }}>Templates</div>
            </ListItem>
            {templateRows.map((value, index) => (
             <React.Fragment key={index} >
             <ListItem
                key={index}
                sx={{
                  fontSize: "small",
                  backgroundColor:
                    index === selectedIndex ? "#888888" : "transparent",
                  display: "flex",
                }}
                disablePadding
              >
                <ListItemButton
                  onClick={() => {
                    handleSelectedIndex(value, index);
                  }}
                >
                  <div>{value.template_name}</div>
                </ListItemButton>

              </ListItem>
              <Divider />

             </React.Fragment>
            ))}
          </List>
        </Grid>
        <Grid item xs={10} paddingLeft={2}>
          <List disablePadding sx={{ maxHeight: "90vh", overflow: "auto" }}>
            {Object.entries(
              categories.reduce((cat, row) => {
                const { category } = row;
                const category_info = {
                  category: row.category,
                  category_id: row.category_id,
                };
                const category_index = JSON.stringify(category_info);
                if (!cat[category_index]) {
                  cat[category_index] = [];
                }
                cat[category_index].push(row);

                return cat;
              }, {})
            ).map(([value, cat]) => {
              const category_main = JSON.parse(value);
              return (
                <React.Fragment key={`category_main${category_main.category_id}`}>
                  <ListItem key={category_main.category_id} disablePadding>
                    <List disablePadding key={`check${category_main.category_id}`}>
                      <FormControlLabel
                        key={category_main.category_id}
                        label={
                          <div style={{ fontWeight: "bold" }}>
                            {" "}
                            {category_main.category}
                          </div>
                        }
                        control={
                          <Checkbox
                            onChange={handleMainCategoryCheckChanged}
                            disabled={selectedTemplate.template_type === 1}
                            checked={validateChecked(category_main)}
                          />
                        }
                      />
                      {cat.length > 1 && (
                        <List disablePadding>
                          {cat.map((category, index) => (
                          <React.Fragment key={`category-${index}`} >
                          <ListItem
                              key={index}
                              disablePadding
                              sx={{ paddingLeft: 3, display: "flex", height: "30px" }}
                              
                            >
                              <FormControlLabel
                                key={index}
                                label={
                                  category.sub_category || category.category
                                }
                                control={
                                  <Checkbox
                                    checked={validateChecked(category_main)}
                                    onChange={(e) => {
                                      handleCategoryCheck(e, value, category);
                                    }}
                                    disabled={
                                      selectedTemplate.template_type === 1
                                    }
                                  />
                                }
                              />
                            </ListItem>

                          </React.Fragment>
                          ))}
                        </List>
                      )}
                    </List>
                  </ListItem>{" "}
                </React.Fragment>
              );
            })}
          </List>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CategoryTemplate;
