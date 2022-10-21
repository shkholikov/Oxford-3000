import * as React from "react";
import { useEffect, useState } from "react";
import { Table, Input, Form, TextArea, Grid, Header, Icon, Divider, Button, Segment, Dimmer, Loader, Image, Modal } from "semantic-ui-react";
import { db } from "./firebase";
import { onValue, ref, set } from "firebase/database";

interface IComponentState {
	Id: number;
	Word: string;
	Translation: string;
	Example: string;
}

type ActionType = "translation" | "example";

function App() {
	const [state, setState] = useState<IComponentState[]>([]);
	const [stateUpdates, setStateUpdates] = useState<boolean>(false);
	const [unchangedState, setUnchangedState] = useState<boolean>(false);
	const [dataLoaded, setDataLoaded] = useState<boolean>(false);
	const [savedMsgOpen, setSavedMsgOpen] = useState<boolean>(false);

	useEffect(() => {
		const dbRef = ref(db, "sheet");
		onValue(dbRef, (snapshot) => {
			const data = snapshot.val();
			if (data !== null) {
				setState(data);
				setDataLoaded(true);
			}
		});
	}, []);

	const handleText = (event: any, id: number | string, action: ActionType): void => {
		const cloneData: any = state;
		switch (action) {
			case "translation":
				cloneData[id].Translation = event.target.value;
				setState(cloneData);
				break;
			case "example":
				cloneData[id].Example = event.target.value;
				setState(cloneData);
				break;
			default:
				break;
		}
	};

	const onSave = (): void => {
		setStateUpdates(true);
		set(ref(db, "sheet"), state)
			.then(() => {
				setStateUpdates(false);
				setSavedMsgOpen(true);
			})
			.catch((err) => {
				console.error("Error occured during saving the data: " + err);
			});
	};

	const savedModalWindow = (
		<Modal centered={true} size="mini" open={savedMsgOpen} onClose={() => setSavedMsgOpen(false)}>
			<Modal.Header>Thank you!</Modal.Header>
			<Modal.Content>
				<Modal.Description>Your data has been saved.</Modal.Description>
			</Modal.Content>
			<Modal.Actions>
				<Button onClick={() => setSavedMsgOpen(false)}>OK</Button>
			</Modal.Actions>
		</Modal>
	);

	return (
		<div>
			<Grid>
				<Grid.Row centered>
					<Grid.Column textAlign="center" width={12}>
						<Header as="h1" icon>
							<Icon name="translate" color="blue" />
							Oxford 3000 Wordlist
							<Header.Subheader>What is Oxford 3000 wordlist?</Header.Subheader>
						</Header>
						<Header as="h3">
							If you know 2500-3000 words, you will be able to understand 80% of the language used in business and everyday communication. The
							remaining 20% can be inferred from context. That’s why it’s important to know the most commonly used words to speed up your language
							learning journey and to become fluent faster. Oxford composed a list of 3000 most common words in the English language that are
							necessary to know in order to communicate fluently. By the way, to reach the Upper-Intermediate level, you need to learn at least 3000
							words!
						</Header>
						<Header as="h3" icon>
							<Icon name="settings" color="blue" />
							What to do with the list?
						</Header>
						<Header as="h3">
							Make a copy of it and create two columns: translation and examples. Work through the list writing down the translation and an example
							sentence for each word. This will allow you to remember the words better.
						</Header>
					</Grid.Column>
				</Grid.Row>
				<Divider horizontal>Let's get started</Divider>
				<Grid.Row centered>
					<Grid.Column textAlign="center">
						<Button color="blue" size="large" loading={stateUpdates} onClick={onSave}>
							Save changes
						</Button>
					</Grid.Column>
				</Grid.Row>
				<Grid.Row centered>
					<Grid.Column width={15}>
						{savedModalWindow}
						{dataLoaded === true ? (
							<Table color="blue" striped size="large" sortable={true}>
								<Table.Header>
									<Table.Row>
										<Table.HeaderCell>
											<Icon name="numbered list" />
										</Table.HeaderCell>
										<Table.HeaderCell>Word</Table.HeaderCell>
										<Table.HeaderCell>Translation</Table.HeaderCell>
										<Table.HeaderCell>Example</Table.HeaderCell>
									</Table.Row>
								</Table.Header>

								<Table.Body>
									{state?.map((item, id) => (
										<Table.Row key={id}>
											<Table.Cell>{item.Id}</Table.Cell>
											<Table.Cell width={5}>{item.Word}</Table.Cell>
											<Table.Cell width={5}>
												<Input
													fluid
													icon={"translate"}
													iconPosition="left"
													placeholder="Enter translation"
													defaultValue={item.Translation}
													onChange={(e) => handleText(e, id, "translation")}
												/>
											</Table.Cell>
											<Table.Cell width={6}>
												<Form>
													<TextArea
														icon={"file word outline"}
														placeholder="Write an examples"
														defaultValue={item.Example}
														rows={2}
														onInput={(e) => handleText(e, id, "example")}
													/>
												</Form>
											</Table.Cell>
										</Table.Row>
									))}
								</Table.Body>
							</Table>
						) : (
							<Segment>
								<Dimmer active inverted>
									<Loader inverted content="Loading data" />
								</Dimmer>
								<Image src="https://react.semantic-ui.com/images/wireframe/short-paragraph.png" />
							</Segment>
						)}
					</Grid.Column>
				</Grid.Row>
			</Grid>
		</div>
	);
}

export default App;
