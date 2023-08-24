import React, { useState, useCallback, useEffect } from "react";
import { Button, Offcanvas, Form, Stack, InputGroup } from "react-bootstrap";
import { MdOutlineSearch } from "react-icons/md";
import { useTheme } from "../context/ThemeContext";
import { CATEGORIES, defaultFetchOptions } from "../constants";
import DropDownCheckBox from "./DropDownCheckBox";
import { useFetchCounts } from "../hooks/useFetchCounts";

type SearchFilterPropsType = {
  reFetchEvents: (newOptions: FetchRequest) => void;
  savedLocations: SavedLocations[] | null;
  category: string;
};

const SearchFilter: React.FC<SearchFilterPropsType> = ({ reFetchEvents, savedLocations, category }) => {
  const [show, setShow] = useState(false);
  const [newOptions, setNewOptions] = useState(defaultFetchOptions);
  const { counts } = useFetchCounts();
  const { theme } = useTheme();

  const open = () => {
    document.body.setAttribute("data-bs-theme", theme);
    setShow(true);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setShow(false);
    reFetchEvents(newOptions);
    setNewOptions(defaultFetchOptions);
  };

  const changeOptions = (newOption: Partial<FetchRequest>) => setNewOptions((prev) => ({ ...prev, ...newOption }));

  useEffect(() => {
    console.log(newOptions);
  }, [newOptions]);

  return (
    <React.Fragment>
      <Button variant={theme} className="ms-auto" onClick={open}>
        <MdOutlineSearch fontSize={16} /> Search Events
      </Button>

      <Offcanvas show={show} onHide={() => setShow(false)}>
        <Offcanvas.Header closeButton className="d-flex align-items-center">
          <Offcanvas.Title>
            <Stack direction="horizontal" gap={1}>
              <MdOutlineSearch fontSize={24} />
              <Form.Control
                size="sm"
                type="text"
                placeholder="Event Search"
                onChange={(e) => changeOptions({ name: e.target.value })}
              />
            </Stack>
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body style={{ height: "100%" }} className="d-flex flex-column justify-content-between">
          <Form onSubmit={handleSubmit} className="d-flex flex-column h-100 justify-content-between">
            <Form.Group>
              <InputGroup className="mb-2">
                <InputGroup.Text id="basic-addon1">Locations</InputGroup.Text>
                <Form.Select
                  onChange={(e) => changeOptions({ location: e.target.value })}
                  defaultValue={defaultFetchOptions.location}
                  disabled={Boolean(newOptions.name) || !["active", ""].includes(newOptions.status)}
                >
                  {savedLocations?.map((location) => (
                    <option value={location.location_id} key={location.location_id}>
                      {location.name}
                    </option>
                  ))}
                  <option value="all">All locations</option>
                </Form.Select>
              </InputGroup>

              <InputGroup className="mb-2">
                <InputGroup.Text id="basic-addon2">Limit</InputGroup.Text>
                <Form.Control
                  size="sm"
                  type="number"
                  max={defaultFetchOptions.limit * 5}
                  min={0}
                  onChange={(e) => changeOptions({ limit: +e.target.value })}
                  defaultValue={defaultFetchOptions.limit}
                />
              </InputGroup>

              <Stack direction="horizontal" gap={1}>
                <InputGroup className="mb-2 justify-content-center">
                  <DropDownCheckBox
                    title="Categories"
                    changeOptions={changeOptions}
                    parameter="category"
                    currentCategory={category}
                    itemsList={CATEGORIES}
                  />
                </InputGroup>
                <InputGroup className="mb-2 justify-content-center">
                  <DropDownCheckBox
                    title="Labels"
                    changeOptions={changeOptions}
                    parameter="label"
                    currentCategory={category}
                    itemsList={counts ? Object.keys(counts?.labels) : []}
                  />
                </InputGroup>
                <InputGroup className="mb-2 justify-content-center">
                  <DropDownCheckBox
                    title="Event status"
                    changeOptions={changeOptions}
                    parameter="status"
                    currentCategory={category}
                    itemsList={["Unset", "Active", "Predicted", "Canceled"]}
                  />
                </InputGroup>
              </Stack>
            </Form.Group>

            <Button variant="flat" type="submit">
              Find Events
            </Button>
          </Form>
        </Offcanvas.Body>
      </Offcanvas>
    </React.Fragment>
  );
};

export default SearchFilter;
