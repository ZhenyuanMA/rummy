# include <stdio.h>
# include <stdlib.h>

int main(int argc, char *argv[]){

	int num_child = atoi(argv[1]);
	int hands[num_child][19];
	int cards[13][4];
	int k = 2, j, i;
	char suits[] = {'S', 'H', 'D', 'C'};
	char ranks[] = {'A', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K'};
	int count[13];
	int num_card;
	int rummy[6][4];
	int num_rummy;
	int temp, num_remaining, num;
	int remaining[18];


	for (i = 0; i < num_child; i++){
		for (j = 0; j < 18; j++){
			hands[i][j] = 0;
		}
	}

	j = 0;
	while (k < argc){
		for (i = 0; i < num_child; i++){
			hands[i][j] = k;
			k++;
			if (k == argc){
				break;
			}
		}
		j = j + 1;
	}
	printf("\n");

	int pid, cid;

	for (i = 0; i < num_child; i++){
		pid = fork();
		
		if (pid < 0) {
			printf("Fork Failed\n");
			exit(1);
		}
		if (pid == 0) {
			sleep(1);
			int num = 0;
			while (hands[i][num] != 0){
				num = num + 1;
			}
			printf("Child %d, pid %d: I have %d cards\n", i + 1, getpid(), num);
			
			sleep(1);
			printf("Child %d, pid %d: ", i + 1, getpid());
			for (j = 0; j < num; j++){
				printf("%s ", argv[hands[i][j]]);
			}
			printf("\n");

			if (num < 9){
				printf("Child %d, pid %d: cannot rummy with %d cards, %d cards remaining ", i + 1, getpid(), num, num);
				for (j = 0; j < num; j++){
					printf("%s ", argv[hands[i][j]]);
				}
				printf("\n");
			}

			int k = 9;
			while (k <= num){
				for (int a = 0; a < 4; a++){
					for (int b = 0; b < 13; b++){
						cards[b][a] = 0;
					}
				}

				for (int a = 0; a < 4; a++){
					for (int b = 0; b < 6; b++){
						rummy[b][a] = 0;
					}
				}

				for (j = 0; j < k; j++){
					char suit = argv[hands[i][j]][0];
					char rank = argv[hands[i][j]][1];
					for (int a = 0; a < 4; a++){
						for (int b = 0; b < 13; b++){
							if (suit == suits[a] && rank == ranks[b]){
								cards[b][a] = hands[i][j];
							}
						}
					}
				}

				//judge
				for (int b = 0; b < 13; b++){
					num_card = 0;
					for (int a = 0; a < 4; a++){
						if (cards[b][a] != 0){
							num_card++;
						}
					}
					count[b] = num_card;
				}

				num_rummy = 0;
				for (j = 12; j >= 0; j--){
					if (count[j] == 4) {
						rummy[num_rummy][0] = cards[j][0];
						rummy[num_rummy][1] = cards[j][1];
						rummy[num_rummy][2] = cards[j][2];
						rummy[num_rummy][3] = 0;
						cards[j][0] = 0;
						cards[j][1] = 0;
						cards[j][2] = 0;
						count[j] = 1;
						num_rummy++;
					}
				}

				for (j = 12; j >= 0; j--){
					if (count[j] == 3){
						temp = 6;
						for (int a = 0; a < 4; a++){
							if (cards[j][a] != 0){
								temp = temp - a;
							}
						}
						switch (temp) {
							case 0: {
								rummy[num_rummy][0] = cards[j][1];
								rummy[num_rummy][1] = cards[j][2];
								rummy[num_rummy][2] = cards[j][3];
								rummy[num_rummy][3] = 0;
								cards[j][1] = 0;
								cards[j][2] = 0;
								cards[j][3] = 0;
								count[j] = 0;
								num_rummy++;
								break;
							}
							case 1: {
								rummy[num_rummy][0] = cards[j][0];
								rummy[num_rummy][1] = cards[j][2];
								rummy[num_rummy][2] = cards[j][3];
								rummy[num_rummy][3] = 0;
								cards[j][0] = 0;
								cards[j][2] = 0;
								cards[j][3] = 0;
								count[j] = 0;
								num_rummy++;
								break;
							}
							case 2: {
								rummy[num_rummy][0] = cards[j][0];
								rummy[num_rummy][1] = cards[j][1];
								rummy[num_rummy][2] = cards[j][3];
								rummy[num_rummy][3] = 0;
								cards[j][0] = 0;
								cards[j][1] = 0;
								cards[j][3] = 0;
								count[j] = 0;
								num_rummy++;
								break;
							}
							case 3: {
								rummy[num_rummy][0] = cards[j][0];
								rummy[num_rummy][1] = cards[j][1];
								rummy[num_rummy][2] = cards[j][2];
								rummy[num_rummy][3] = 0;
								cards[j][0] = 0;
								cards[j][1] = 0;
								cards[j][2] = 0;
								count[j] = 0;
								num_rummy++;
								break;
							}
						}
					}
				}

				for (j = 12; j >= 2; j--){
					if (count[j] > 0 && count[j - 1] > 0 && count[j - 2] > 0){
						for (int a = 0; a < 4; a++){
							if (cards[j][a] != 0){
								rummy[num_rummy][0] = cards[j][a];
								cards[j][a] = 0;
								count[j]--;
								break;
							}
						}
						for (int a = 0; a < 4; a++){
							if (cards[j - 1][a] != 0){
								rummy[num_rummy][1] = cards[j - 1][a];
								cards[j - 1][a] = 0;
								count[j - 1]--;
								break;
							}
						}
						for (int a = 0; a < 4; a++){
							if (cards[j - 2][a] != 0){
								rummy[num_rummy][2] = cards[j - 2][a];
								cards[j - 2][a] = 0;
								count[j - 2]--;
								break;
							}
						}
						rummy[num_rummy][3] = 1;
						num_rummy++;
					}
				}

				num_remaining = 0;
				for (int b = 0; b < 13; b++){
					for (int a = 0; a < 4; a++){
						if (cards[b][a] != 0){
							remaining[num_remaining] = cards[b][a];
							num_remaining++;
						}
					}
				}

				if (num_rummy >= 3){
					for (int a = 0; a < 3; a++) {
						if (rummy[a][3] == 0){
							sleep(1);
							printf("Child %d, pid %d: set <%s %s %s>\n", i + 1, getpid(), argv[rummy[a][0]], argv[rummy[a][1]], argv[rummy[a][2]]);		
						}
						else {
							sleep(1);
							printf("Child %d, pid %d: run <%s %s %s>\n", i + 1, getpid(), argv[rummy[a][0]], argv[rummy[a][1]], argv[rummy[a][2]]);		
						}
					}
					sleep(1);
					printf("Child %d, pid %d: rummy with %d cards, %d card remaining ", i + 1, getpid(), k, num_remaining);
					for (j = 0; j < num_remaining; j++){
						printf("%s ", argv[remaining[j]]);
					}
					printf("\n");
					break;
				}
				k++;
			}

			if (k > num){
				for (int a = 0; a < num_rummy; a++) {
					if (rummy[a][3] == 0){
						sleep(1);
						printf("Child %d, pid %d: set <%s %s %s>\n", i + 1, getpid(), argv[rummy[a][0]], argv[rummy[a][1]], argv[rummy[a][2]]);		
					}
					else {
						sleep(1);
						printf("Child %d, pid %d: run <%s %s %s>\n", i + 1, getpid(), argv[rummy[a][0]], argv[rummy[a][1]], argv[rummy[a][2]]);		
					}
				}
				sleep(1);
				printf("Child %d, pid %d: cannot rummy with %d cards, %d cards remaining ", num, getpid(), num, num_remaining);
				for (j = 0; j < num_remaining; j++){
					printf("%s ", argv[remaining[j]]);
				}
				printf("\n");							
			}

			exit(0);
			break;
		}
		
	}

}