
library(tidyverse)
library(dplyr)
#library(tidyjson)
library(writexl)
library("rjson")

url <-  "/Users/sophiamlawer/Documents/UChicago/Winter 2022/Data Viz/HW 3/q3/player-lookup.json"

result <- fromJSON(txt=url)

df <- result %>% spread_all %>%
  select(c("player_id","player_name","age_start","year_start","year_end","last_name"))

df1 <- read.table(file = '/Users/sophiamlawer/Documents/UChicago/Winter 2022/Data Viz/HW 3/q3/cumulative-stats.tsv', sep = '\t', header = TRUE)

df_full <- merge(df1, df, by="player_id")

max <- df_full %>%
  group_by(player_id) %>%
  summarise(max = max(playoff_wins, na.rm=TRUE))

df_full <- df_full %>%
  mutate(
    age = age_start + (year -year_start),
  )
df_full <- merge(df_full, max, by="player_id")

write_xlsx(df_full,"/Users/sophiamlawer/Documents/UChicago/Winter 2022/Data Viz/HW 3/q3/cumulative-stats.csv")

